"""
Required Features:
- 
"""
from flask       import Flask, request, jsonify

import requests
import random
import json
import math
import os

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

########################################## Run the Flask App
app = Flask(__name__)
##########################################
@app.get("/num_users")
def return_features():
    if request.is_json:
        incoming_request = request.get_json()
    ...

@app.post("/user_recc")
def user_recc():
    if request.is_json:
        incoming_request = request.get_json()
        sample_user: str = incoming_request['USER'] if 'USER' in incoming_request else None
    item = requests.get("http://127.0.0.1:5000/user_base")
    item = json.loads(item.content.decode())
    user_data = item[sample_user]
    others = {u:item[u] for u in item.keys() if u != sample_user}
    scores = [(o_data, cosine_dic(o_data,user_data)) for o_user,o_data in others.items()]
    scores.sort(key = lambda x: x[1], reverse=True)
    updated_sim = scores[0][0] # Gets the user data of the one's closest to the user
    return jsonify(random.choices(population=list(updated_sim.keys()),weights = list(updated_sim.values()), k = 1) )