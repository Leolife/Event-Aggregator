"""
Required Features:
- Obtain the metrics of a particular user
- Search by multiple criteria. (email)
- 
"""
from flask       import Flask, request, jsonify
from Levenshtein import ratio

import random
import json
import os

def set_default_path(directory: str | None = 'Event-Aggregator') -> str:
    """Changes the working directory to Event-Aggregator"""
    while not os.getcwd().endswith(directory):
        os.chdir('..')
        if len(os.getcwd()) == 0:
            raise FileExistsError
    return os.getcwd()

def load_json(FileName: str) -> dict:
    with open(FileName) as f:
        data = json.load(f)
    return data

##########################################
class user_Metrics:
    def __init__(self,file_path: str):
        self.users: dict  = load_json(file_path)
        #self.n_users: int = len(self.users.keys())
##########################################
events_path  = os.path.join('Data'   ,'User_Data.json')
##########################################
UserBase    = user_Metrics(file_path=events_path)
########################################## Run the Flask App
app = Flask(__name__)

@app.get("/identify")
def identify():
    print('User Base')
    return {'Message':'ok'}, 200
##########################################
@app.get("/num_users")
def return_features():
    """Needs to return dtypes as well."""
    return len(UserBase.users.keys())

@app.post("/search")
def search_func():
    """This will be modified to query the firebase db"""
    if request.is_json:
        incoming_request = request.get_json()
        u    : str = incoming_request['USER']       if 'USER'   in incoming_request  else None
        search_by: str = incoming_request['BY']     if 'BY'     in incoming_request else 'Title'
        num      : int = incoming_request['NUMBER'] if 'NUMBER' in incoming_request else None
    ...

@app.post("/random_sample")
def random_events():
    if request.is_json:
        incoming_request = request.get_json()
        num: int = incoming_request['NUMBER']  if 'NUMBER'  in incoming_request else None
    selected_users = random.choices(population=list(UserBase.users.keys()), k = num)
    return {u:UserBase.users[u] for u in selected_users}

@app.post("/user_base_o")
def user_base_o():
    """Returns every user except for the unspecficied user."""
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