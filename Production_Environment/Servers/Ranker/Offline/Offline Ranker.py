"""
Required Features:
- 
"""
from flask       import Flask, request, jsonify
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

#app = Flask(__name__)
##########################################
#@app.get("/get_columns")
def return_features():
    ...

#@app.post("/search")
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

if __name__ == '__main__':
    ...
   