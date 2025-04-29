"""
Required Features:
- Allows for events to be searched based on criterias
- Abstracts the underlying rec system for both item to item and user to user
- 
"""
from flask import Flask, request, jsonify

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
        self.event_ip    = '192.168.150.3'
        self.recc_ip     = '192.168.150.6'
        self.events_port = '5001'
        self.reccs       = '5004'

    def get_url(self,server, func) -> str:
        """Returns the url"""
        url = None
        match server:
            case 'events':
                # Makes requests to the front server
                url = f'http://{self.event_ip}:{self.events_port}'
            case 'ranker':
                url = f'http://{self.recc_ip}:{self.reccs}'
            case _:
                return None

        match func:
            case 'literal':
                return f'{url}/search_literal'
            case 'columns':
                return f'{url}/get_features'
            case 'item':
                return f'{url}/item'
            case 'user':
                return f'{url}/user_recc'
            case 'search':
                return f'{url}/search'
            case _:
                return None
        
##########################################
IPs = IP_Data()

app = Flask(__name__)
##########################################
@app.get("/identify")
def identify():
    print('Front Server')
    return {'Message':'ok'}, 200

@app.post("/search")
def search_func():
    """ """
    if request.is_json:
        incoming_request = request.get_json()
        assert('QUERY'  in incoming_request)
        #assert('BY'     in incoming_request)
        assert('NUMBER' in incoming_request)
        q        : str = incoming_request['QUERY']
        #search_by: str = incoming_request['BY']
        n        : int = incoming_request['NUMBER']

    # Makes requests to the front server

    url = IPs.get_url(server='events' , func='search')

    data = {
            "QUERY"  : q,
            "NUMBER" : n
            }

    items: list[tuple] = query(url, data, mode='POST')

    results = {}
    for item in items:
        assert(len(item) == 11)
        results[item[0]] = {
            'Title': item[1],
            'Date' : item[2],
            'Mainpage' : item[3],
            'address1' : item[4],
            'address2' : item[5],
            'when'     : item[6],
            'Thumb'    : item[7],
            'Image'    : item[8],
            'Desc'     : item[9]
        }
    return jsonify(items), 200

@app.post("/recc")
def reccomendation():
    """Makes a recommendation provided a user"""
    if request.is_json:
        """
        Format:
        query : 
        {
            USER_ID : str -> user id provided by front end in the format of firebase.
            MODE    : str -> Method of providing recc. 
            NUMBER  : int -> Number of events to return
        }
        """
        incoming_request = request.get_json()
        assert("USER_ID" in incoming_request)
        assert("NUMBER"  in incoming_request)

        user_ID = incoming_request['USER_ID'] 
        number = incoming_request['NUMBER']
        mode   = incoming_request['MODE'] if 'MODE' in incoming_request else 'auto'

    match mode:
        case 'auto':
            ...
        case 'item':
            """
            """
            url = IPs.get_url(server = 'ranker',func = 'item')
            print(url)
            select = {
                'USER_ID': user_ID,
                'NUMBER': number
            }
            return query(url,select,mode = 'POST'), 200
        case 'user':
            url = IPs.get_url(server = 'ranker',func = 'user')
            print(url)
            select = {
                'USER_ID': user_ID,
                'NUMBER': number
            }
            return query(url,select,mode = 'POST'), 200
        case _:
            print('Mode does not match any specified method.')


streams_URL = "https://api.twitch.tv/helix/streams?"
headers = {
    'Content-Type': 'application/json',
    'Client-ID': 'ekp4auk5xo1dmmqdaz0a22aud0gym9',
    'Authorization': 'Bearer ni31v213kg1jo0abtno66e6992l4gy'
}
user_logins = [
    "RocketLeague",
    "VALORANT_Americas",
    "Rainbow6",
    "ESLCS",
    "PGL_Dota2",
    "dota2_paragon_ru",
    "otplol_",
    "Gaules",
    "ESLCSb",
    "LCK",
    "Halo",
    "LEC",
    "WorldofTanks",
    "PGL_DOTA2EN2",
    "LTANorth",
    "VALORANT_EMEA",
    "CroissantStrikeTV",
    "dota2_paragon_ru2",
    "LCK_Carry",
    "Fortnite",
    "TwitchRivals",
    "VGBootCamp",
    "Warframe"
]
params = {'user_login': user_logins}
@app.get("/streams")
def get_live():
    """Get livestreams from the most popular esports channels on Twitch"""
    response = requests.get(streams_URL,headers=headers, params=params)
    return response.json()["data"]
