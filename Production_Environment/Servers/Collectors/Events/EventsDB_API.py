"""
Required Features:
- Obtain all the labels
- Search by
- Obtain a random Sample
"""
from flask       import Flask, request, jsonify
from Levenshtein import ratio, jaro, distance
from collections import Counter

import pandas as pd
import gzip
import json
import math
import os
import re

WORD = re.compile(r"\w+")

def get_cosine(vec1, vec2):
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])

    sum1 = sum([vec1[x] ** 2 for x in list(vec1.keys())])
    sum2 = sum([vec2[x] ** 2 for x in list(vec2.keys())])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if not denominator:
        return 0.0
    else:
        return float(numerator) / denominator

def text_to_vector(text):
    words = WORD.findall(text)
    return Counter(words)


def save_json(Filename, data):
    with gzip.open(Filename, 'w') as fout:
        fout.write(json.dumps(data).encode('utf-8'))

def load_json(FileName, data):
    with gzip.open(FileName, 'r') as fin:
        data = json.loads(fin.read().decode('utf-8'))
    return data

##############################################
class events_DB:
    def __init__(self,file_path: str):
        self.db  : pd.DataFrame = pd.read_csv(file_path, sep = ',')
##########################################
events_path = os.path.join('Data','Final_Events.csv')
##########################################
events       = events_DB(file_path=events_path)
########################################## Run the Flask App
app = Flask(__name__)
##############################################
@app.get("/get_features")
def return_features():
    """Needs to return dtypes as well."""
    return list(events.db.columns), 200

@app.post("/search_by")
def search_func():
    """ Searches the catalog based on a feature: Default -> Title"""
    if request.is_json:
        incoming_request = request.get_json()
        q        : str = incoming_request['QUERY']
        search_by: str = incoming_request['BY']    
        num      : int = incoming_request['NUMBER']

    assert(events.db[search_by].dtype == 'O')

    metric = events.db[search_by]\
        .apply(func = lambda s: s.replace(' ','')) \
        .apply(func = lambda s: s.lower()) \
        .apply(func = jaro, args = (q,))\
        .sort_values(ascending=False)\
        [:num].index
    
    return json.loads((events.db.iloc[metric].fillna(value = '').to_json(orient='index'))), 200

@app.post("/search_cosine")
def search_cosine():
    """ Searches the catalog based on the cosine similarty between the frequency of words."""
    if request.is_json:
        incoming_request = request.get_json()
        q        : str = incoming_request['QUERY'].lower()
        search_by: str = incoming_request['BY']    
        num      : int = incoming_request['NUMBER']

    assert(events.db[search_by].dtype == 'O')

    q = text_to_vector(q)
    metric = events.db[search_by]\
        .apply(func = lambda s: s.lower())\
        .apply(func = text_to_vector)\
        .apply(func = get_cosine, args = (q,))\
        .sort_values(ascending=False)\
        [:num].index
    
    return json.loads((events.db.iloc[metric].fillna(value = '').to_json(orient='index'))), 200

@app.post("/search_literal")
def search_literal():
    """ """
    if request.is_json:
        incoming_request = request.get_json()
        q        : str = incoming_request['QUERY'].lower()
        search_by: str = incoming_request['BY']    
        num      : int = incoming_request['NUMBER']

    assert(events.db[search_by].dtype == 'O')

    # We search based on the literal string matching.
    metric = events.db[events.db[search_by].apply(lambda s: s.lower()) == q].index
    
    return json.loads((events.db.iloc[metric].fillna(value = '').to_json(orient='index'))), 200


@app.post("/random_sample")
def random_events():
    if request.is_json:
        incoming_request = request.get_json()
        num: int = incoming_request['NUMBER']  if 'NUMBER'  in incoming_request else None
        if num:
            return json.loads(events.db.sample(n = num).fillna(value='').to_json(orient='index')), 200
        return {'Message':'Bad Input'}, 400
    
@app.post("/search_idx")
def search_idx():
    if request.is_json:
        incoming_request = request.get_json()
        idx: int = int(incoming_request['IDX']) if 'IDX'  in incoming_request else None
    return json.loads((events.db.iloc[idx].fillna(value = '').to_json(orient='index'))), 200
