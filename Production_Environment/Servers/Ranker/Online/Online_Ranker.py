"""
Required Features:
- 
"""

from flask       import Flask, request, jsonify
from collections import Counter

import requests
import random
import json
import gzip
import math

def cosine_dic(dic1,dic2):
    numerator = 0
    dena = 0
    for key1,val1 in dic1.items():
        numerator += val1*dic2.get(key1,0.0)
        dena += val1*val1
    denb = 0
    for val2 in dic2.values():
        denb += val2*val2
    return numerator/math.sqrt(dena*denb)

def load_json(FileName: str) -> dict:
    with open(FileName) as f:
        data = json.load(f)
    return data

def query(url, data = None, mode = None):
    match mode:
        case 'POST':
            item = requests.post(url,json=data)
            item = json.loads(item.content.decode())
        case 'GET':
            item = requests.get(url)
            item = json.loads(item.content.decode())
    return item

##########################################
class IP_Data:
    def __init__(self):
        self.local_host   = '127.0.0.1'
        self.events_port  = '5001'
        self.Offline_R    = '5003'
        self.user_db      = '5002'

    def get_url(self,server, func) -> str:
        """Returns the url"""
        url = None
        match server:
            case 'events':
                # Makes requests to the front server
                url = f'http://{self.local_host}:{self.events_port}'
            case 'ranker':
                url = f'http://{self.local_host}:{self.Offline_R}'
            case 'users':
                url = f'http://{self.local_host}:{self.user_db}'
            case _:
                return None

        match func:
            case 'desc':
                # From events db
                return f'{url}/get_descs'
            case 'col':
                # Get description from events
                return f'{url}/get_col'
            case 'rows':
                # Gets event information from a list of IDs
                return f'{url}/get_rows'
            case 'weights':
                # Returns weights from offline ranker
                return f'{url}/get_weights'
            case 'sample':
                # Returns weights from offline ranker
                return f'{url}/random_sample'
            case 'userbase':
                return f'{url}/user_base'
            case 'interact':
                return f'{url}/interactions'
            case _:
                return None

##########################################
IPs = IP_Data()
app = Flask(__name__)

@app.get("/identify")
def identify():
    print('Online Ranker')
    return {'Message':'ok'}, 200
##########################################
@app.post("/item")
def item_to_item(): 
    """
    Steps
    1) Parse the request coming from front server
    2) Obtains the user interactions from online collector
    3) Get the updated weights from offline ranker
    4) Normalize and sample from event IDs
    5) Query database with a list of IDs to obtain the data
    6) 
    """
    #############################################################
    # 1 Pase the input
    if request.is_json:
        incoming_request = request.get_json()
        assert('USER_ID' in incoming_request)
        assert('NUMBER'  in incoming_request)
        user_id = incoming_request['USER_ID']
        n_items = incoming_request['NUMBER']
    #############################################################
    # 2 Obtain the user interactions
    url  = IPs.get_url(server='users',func = 'interact')
    select = {
        'USER_ID': user_id
    }
    interactions = query(url = url, data = select, mode = 'POST')
    #############################################################
    # 3 Obtain the weights
    url  = IPs.get_url(server='ranker',func = 'weights')
    select = {
        'ITEMS': interactions
    }
    weights: Counter = query(url = url, data = select, mode = 'POST')

    #############################################################
    # Get all the unique IDs from events db
    url  =  IPs.get_url(server='events',func = 'col')
    select = {
        'COL': 'ID'
    }
    ids: list = query(url = url, data = select, mode = 'POST')
    #############################################################
    # Reorder so ids and weights alight
    weights = [weights[str(i)] for i in ids]
    #############################################################
    # 4 noramlize and sample
    selections: tuple[int] = tuple(random.choices(population=ids,weights = weights, k = n_items))
    #############################################################
    url  =  IPs.get_url(server='events',func = 'rows')
    select = {
        'IDS': selections
    }
    events_items  = query(url = url, data = select, mode = 'POST')

    return events_items, 200


@app.post("/user_recc")
def user_recc():
    if request.is_json:
        incoming_request = request.get_json()
        sample_user: str = incoming_request['USER_ID'] if 'USER_ID' in incoming_request else None
        n_events   : int = incoming_request['NUMBER']  if 'NUMBER' in incoming_request else None
 
    url = IPs.get_url(server = 'users',func = 'userbase')

    item = query(url = url, mode = 'GET')

    assert(sample_user in item.keys()) # This may fail

    user_data = item[sample_user]
    others = {u:item[u] for u in item.keys() if u != sample_user}
    scores = [(o_data, cosine_dic(o_data,user_data)) for o_user,o_data in others.items()]
    scores.sort(key = lambda x: x[1], reverse=True)
    updated_sim = scores[0][0] # Gets the user data of the one's closest to the user
    event_ids = random.choices(population=list(updated_sim.keys()),weights = list(updated_sim.values()), k = n_events)
    #############################################################
    url  =  IPs.get_url(server='events',func = 'rows')
    select = {
        'IDS': event_ids
    }
    events_items  = query(url = url, data = select, mode = 'POST')

    return events_items, 200