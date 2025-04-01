"""
Required Features:
- Obtain all the labels
- Search by
- Obtain a random Sample
"""
from flask              import Flask, request, jsonify
from File_Paths import set_default_path
from Levenshtein        import ratio

import pandas as pd
import os

class user_metrics:
    def __init__(self,file_path: str):
        self.db    : pd.DataFrame = pd.read_csv(file_path, sep = ',')
        self.labels: list         = list(self.db.columns)
app = Flask(__name__)

###########################################################################
@app.get("/dump_records")
def return_records():
    """Return an internal view of the records and what users have seen"""
    return [(user_db.liked),(user_db.disliked)]

@app.post("/seen/record")
def record_seen():
    """ Saves a click from a user into a dict. Expects: {USER_ID: [str], EVENT: [str]} """
    if request.is_json:
        incoming_request = request.get_json()
        user_ID: str = incoming_request['USER_ID']
        event  : str = incoming_request['EVENT'].lower()
    return {'Message': 'ok'}, 200

# flask run -h localhost -p 3000
if __name__ == '__main__':
    ########################################## Running the Flask App
    default_path = os.path.join(set_default_path(),'Production_Environment')
    data_path    = os.path.join(default_path,'Data')
    events_path  = os.path.join(data_path   ,'Final_Events.csv')
    ##########################################
    user_db = user_metrics(file_path=events_path)
    ##########################################