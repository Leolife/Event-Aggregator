"""
Required Features:
- 
"""
from flask       import Flask, request, jsonify
from Levenshtein import ratio

import os

########################################## Run the Flask App
app = Flask(__name__)
##########################################
@app.get("/num_users")
def return_features():
    """Needs to return dtypes as well."""
    return None

@app.post("/search")
def search_func():
    """This will be modified to query the firebase db"""
    if request.is_json:
        incoming_request = request.get_json()
        u    : str = incoming_request['USER']       if 'USER'   in incoming_request  else None
        search_by: str = incoming_request['BY']     if 'BY'      in incoming_request else 'Title'
        num      : int = incoming_request['NUMBER'] if 'NUMBER'  in incoming_request else None
    ...

@app.post("/random_sample")
def random_events():
    if request.is_json:
        incoming_request = request.get_json()
        # num: int = incoming_request['NUMBER']  if 'NUMBER'  in incoming_request else None
    ...

@app.post("/user_base_o")
def user_base_o():
    if request.is_json:
        incoming_request = request.get_json()
        select_user: str = incoming_request['USER']  if 'USER'  in incoming_request else None
    if select_user not in UserBase.users:
        print(f'{select_user=}')
        return {'Message': 'Missing User'}, 400
    print(select_user)
    others = {u:UserBase.users[u]['CLICKED'] for u in UserBase.users.keys() if u != select_user}
    return jsonify(others), 200

@app.get("/user_base")
def user_base():
    others = {u:UserBase.users[u]['CLICKED'] for u in UserBase.users.keys()}
    return jsonify(others), 200