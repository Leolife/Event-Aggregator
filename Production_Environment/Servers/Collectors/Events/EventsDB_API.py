"""
Required Features:
- Obtain all the labels
- Search by
- Obtain a random Sample
"""
from flask       import Flask, request, jsonify
from Levenshtein import ratio

import pandas as pd
import json
import gzip
import os

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
        #self.db_ : pd.DataFrame = pd.read_csv(file_path, sep = ',')
        self.db  : pd.DataFrame = pd.read_csv(file_path, sep = ',', compression = 'gzip')
##########################################
# events_path  = os.path.join('Data','Final_Events.csv')
events_path = os.path.join('Data','Final_Events.csv.gzip')
##########################################
events       = events_DB(file_path=events_path)
########################################## Run the Flask App
app = Flask(__name__)
##############################################
@app.get("/get_features")
def return_features():
    """Needs to return dtypes as well."""
    return list(events.db.columns), 200

@app.post("/search")
def search_func():
    """ Searches the catalog based on a feature: Default -> Title"""
    if request.is_json:
        incoming_request = request.get_json()
        value    : str = incoming_request['VALUE']   if 'VALUE'   in incoming_request else None
        search_by: str = incoming_request['BY']      if 'BY'      in incoming_request else 'Title'
        num      : int = incoming_request['NUMBER']  if 'NUMBER'  in incoming_request else None
    if not value:
        return {'Message': 'Missing Event'}, 400
    
    metric = events.db[search_by]\
        .apply(func = ratio, args = (value,))\
        .sort_values(ascending=False)\
        [:num].index
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
