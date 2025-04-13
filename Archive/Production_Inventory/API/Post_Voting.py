from flask import Flask, request, jsonify
from Levenshtein import ratio

import pandas as pd

########################################## Running the Flask App
app = Flask(__name__)
########################################## Saving the user's data.
class user_metrics:
    """Represents a noSQL database"""
    def __init__(self):
        self.liked    = {}
        self.disliked = {}
user_db = user_metrics()
###########################################################################
@app.post("/post/upvote")
def up_vodte():
    if request.is_json:
        incoming_request = request.get_json()
        user_ID: str = incoming_request['USER_ID']
        post  : str = incoming_request['POST'].lower()
    else:
        return {"error": "Request must be JSON"}, 415
    
    if user_ID not in user_db.liked:
        user_db.liked[user_ID] = {}

    user_db.liked[user_ID][post] = 1

    return {'Message': 'ok'}, 200

@app.post("/post/downvote")
def down_vote():
    if request.is_json:
        incoming_request = request.get_json()
        user_ID: str = incoming_request['USER_ID']
        post   : str = incoming_request['POST'].lower()
    else:
        return {"error": "Request must be JSON"}, 415
    
    if user_ID not in user_db.disliked:
        user_db.disliked[user_ID] = {}

    user_db.disliked[user_ID][post] = -1

    return {'Message': 'ok'}, 200

###########################################################################
@app.get("/dump_records")
def return_records():
    """Return an internal view of the records and what users have seen"""
    return [(user_db.liked),(user_db.disliked)]
###########################################################################

@app.post("/click/record")
def record_click():
    """ Saves a click from a user into a dict. Expects: {USER_ID: [str], EVENT: [str]} """
    if request.is_json:
        incoming_request = request.get_json()
        user_ID: str = incoming_request['USER_ID']
        event  : str = incoming_request['EVENT'].lower()
    else:
        return {"error": "Request must be JSON"}, 415

    if user_ID in user_db.data.keys():
        if event in user_db.data[user_ID].keys():
            user_db.data[user_ID][event] += 1
        else:
            user_db.data[user_ID][event] = 1
    else:
        user_db.data[user_ID] = {}
        user_db.data[user_ID][event] = 1
    return {'Message': 'ok'}, 200

@app.post("/seen/record")
def record_seen():
    """ Saves a click from a user into a dict. Expects: {USER_ID: [str], EVENT: [str]} """
    if request.is_json:
        incoming_request = request.get_json()
        user_ID: str = incoming_request['USER_ID']
        event  : str = incoming_request['EVENT'].lower()
    else:
        return {"error": "Request must be JSON"}, 415

    if user_ID in user_db.data.keys():
        if event not in user_db.data[user_ID].keys():
            user_db.data[user_ID][event] = 0
    else:
        user_db.data[user_ID] = {}
        user_db.data[user_ID][event] = 0
    return {'Message': 'ok'}, 200