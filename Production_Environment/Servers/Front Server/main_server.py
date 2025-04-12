"""
Required Features:
- Allows for events to be searched based on criterias
- Abstracts the underlying rec system for both item to item and user to user
- 
"""
from flask       import Flask, request, jsonify
from Levenshtein import ratio
import requests
import json

def query(url, data = None, mode = None):
    match mode:
        case 'POST':
            item = requests.post(url,json=data)
            item = json.loads(item.content.decode())
        case 'GET':
            item = requests.get(url)
            item = json.loads(item.content.decode())
    return item

########################################## Run the Flask App
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
            case 'sby':
                return f'{url}/search_by'
            case 'literal':
                return f'{url}/search_literal'
            case 'columns':
                return f'{url}/get_features'
            case _:
                return None
        
    
IPs = IP_Data()

app = Flask(__name__)
##########################################
@app.get("/get_columns")
def return_features():
    url = IPs.get_url(server='events' , func='columns')
    return query(url, mode='GET'), 200

@app.post("/search")
def search_func():
    """ """
    if request.is_json:
        incoming_request = request.get_json()
        assert('QUERY'  in incoming_request)
        assert('BY'     in incoming_request)
        assert('NUMBER' in incoming_request)
        q        : str = incoming_request['QUERY']
        search_by: str = incoming_request['BY']
        n        : int = incoming_request['NUMBER']

    # Makes requests to the front server

    url = IPs.get_url(server='events' , func='sby')

    data = {
            "QUERY"  : q,
            "BY"     : search_by,
            "NUMBER" : n
            }

    items = query(url,data, mode='POST')
    
    return items, 200