"""
Required Features:
- 
"""
from sklearn.metrics                 import silhouette_samples, silhouette_score
from sklearn.feature_extraction.text import HashingVectorizer , TfidfTransformer
from sklearn.pipeline                import make_pipeline
from sklearn.decomposition           import TruncatedSVD
from sklearn.preprocessing           import Normalizer
from sklearn.cluster                 import KMeans

lsa_vectorizer = make_pipeline(
    HashingVectorizer(stop_words="english", n_features=1_000),
    TfidfTransformer(),
    TruncatedSVD(n_components=50, random_state=0),
    Normalizer(copy=False),
)

from flask       import Flask, request, jsonify
from collections import Counter
import numpy  as np
import requests
import json
import gzip
import os

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

def query(url, data = None, mode = None):
    match mode:
        case 'POST':
            item = requests.post(url,json=data)
            item = json.loads(item.content.decode())
        case 'GET':
            item = requests.get(url)
            item = json.loads(item.content.decode())
    return item

def kmeans_tune(X_lsa, n_clusters_max = 15,trials = 5) -> list[float]:
    results = []
    for n_clusters in range(2,n_clusters_max):
        c_score = 0
        for seed in range(trials):
            kmeans = KMeans(
                max_iter     = 100,
                n_clusters   = n_clusters,
                n_init       = 10,
                random_state = seed,
            ).fit(X_lsa)
            c_score += silhouette_score(X_lsa,kmeans.labels_)

        c_score /= trials
        results.append(float(c_score))
        # cluster_ids, cluster_sizes = np.unique(kmeans.labels_, return_counts=True)
        # print(f"Number of elements assigned to each cluster: {cluster_sizes}")
    return results

##########################################
class IP_Data:
    def __init__(self):
        self.local_host  = '127.0.0.1'
        self.events_port = '5001'

    def get_url(self,server, func) -> str:
        """Returns the url"""
        url = None
        match server:
            case 'events':
                # Makes requests to the front server
                url = f'http://{self.local_host}:{self.events_port}'
            case _:
                return None

        match func:
            case 'desc':
                return f'{url}/get_descs'
            case _:
                return None
##########################################
class EventRanks:
    def __init__(self, url):
        data_path           = os.path.join(os.getcwd(),'Data')
        self.groupings_path = os.path.join(data_path  ,'Groupings.json')
        self.search_ID_path = os.path.join(data_path  ,'Search_ID.json')
        self.url            = url
        # Check if the gruops have been genererated.
        if os.path.isfile(self.groupings_path) and os.path.isfile(self.search_ID_path):
            self.search_ID, self.groups = self.__load__()
        else:
            self.search_ID, self.groups = self.__generateRanks__()
    
    def reupdate(self):
        self.search_ID, self.groups = self.__generateRanks__()

    def __generateRanks__(self):
        # Obtain the events from the events database
        data      = query(url = self.url, data = None, mode = 'GET')
        IDS, desc = zip(*data)
        IDS, documents = np.array(IDS), np.array(desc)

        # Vectorize our documents
        X_lsa      = lsa_vectorizer.fit_transform(documents)
        results    = kmeans_tune(X_lsa, trials=5)
        n_clusters = np.argmin(results) + 2

        # Cluster based on ideal number of clusters
        kmeans = KMeans(
                max_iter     = 100,
                n_clusters   = n_clusters,
                n_init       = 5,
                random_state = 42,
            ).fit(X_lsa)

        # Group each document IDS with their respective label
        clusters  = [(int(kmeans.labels_[idx]), d) for idx, d in enumerate(IDS)]
        # Use search id to find which label an id belongs to.
        search_id = {d: int(kmeans.labels_[idx]) for idx, d in enumerate(IDS)}
        search_id = {int(ID): int(label) for ID, label in search_id.items()}

        # n_clusters = max(clusters, key = lambda x: x[0])[0]
        groups = {}
        for n in range(n_clusters):
            c = [id for label, id in clusters if label == n]
            groups[f'GROUP {n}'] = c
        
        return search_id, groups

    def __save__(self) -> None:
        with open(self.groupings_path,mode = 'w') as f:
            json.dump(self.groups   ,f, cls = NpEncoder,indent=3)

        with open(self.search_ID_path,mode = 'w') as f:
            json.dump(self.search_id,f, cls = NpEncoder,indent=3)

    def __load__(self) -> None:
        with open(self.groupings_path, mode = 'r') as f:
            d1 = json.load(f)

        with open(self.search_ID_path, mode = 'r') as f:
            d2 = json.load(f)
        
        return d2,d1

##########################################
IPs        = IP_Data()
eventRanks = EventRanks(url = IPs.get_url(server='events', func = 'desc'))
##########################################
app = Flask(__name__)

@app.get("/identify")
def identify():
    print('Offline Ranker')
    return {'Message':'ok'}, 200

##########################################
@app.get("/force_update")
def force_update(): 
    eventRanks.reupdate()
    return {"Message":"ok"}, 200

@app.post("/get_weights")
def get_weights():
    if request.is_json:
        incoming_request = request.get_json()
        if 'ITEMS' not in incoming_request:
            return {"Message":'Invalid Request'}, 400
        freq_items = incoming_request['ITEMS']

    # Makes sure all the events are included.    
    weights = Counter(eventRanks.search_ID.keys())

    for id, freq in freq_items.items():
        assert(type(id) == str)
        label : str  = eventRanks.search_ID[id]
        group : list = eventRanks.groups[f'GROUP {label}']
        group        = Counter({str(id): freq for id, freq in Counter(group).items()})
        for _ in range(freq):
            weights += group
    
    return weights, 200


if __name__ == '__main__':
    ...
    # get_weights(example_request)