from flask import Flask, request, jsonify

import pandas as pd

########################################## Running the Flask App
app = Flask(__name__)
########################################## Event Listings
class event_listings:
    def __init__(self,i: pd.DataFrame):
        self.data = i

# Reading the file and load in the dataset
df = pd.read_csv(filepath_or_buffer = 'Data/events.csv', index_col = 0)
events = event_listings(i = df)
########################################## Saving the user's data.
class user_metrics:
    """Represents a noSQL database"""
    def __init__(self):
        self.data = {}
user_db = user_metrics()
##########################################

@app.get("/events/random_one")
def get_random_event():
    """Get a random events and returns the detail"""
    return eval(events.data.sample(n = 1).to_json(orient='records'))[0]

@app.post("/events/random")
def get_random_events():
    """Returns the NUMBER of n events. Expects: {NUMBER: [int]}"""
    if request.is_json:
        n = request.get_json()['NUMBER']
        return eval(events.data.sample(n = n).to_json(orient='records'))
    return {"error": "Request must be JSON"}, 415

@app.get("/dump_records")
def return_records():
    """Return an internal view of the records and what users have seen"""
    return jsonify(user_db.data)

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

@app.get("/tags")
def unique_tags():
    s = set()
    s = {tag for tags in events.data['tags'] for tag in eval(tags)}
    return list(s), 200


# @app.post("/events")
# def add_events():
#     if request.is_json:
#         incoming_request     = request.get_json()
#         n = incoming_request['Number']
#         random_row = int(n)

#         titles = events.data[['Title']]
#         genres = events.data.iloc[:,1:]

#         # Select one -> random_row
#         t = titles.iloc[random_row]
#         g = genres.iloc[random_row].to_numpy()

#         titles = titles.drop(index = random_row)
#         genres = genres.drop(index = random_row)

#         distances = [ np.linalg.norm(x = row - g, ord = 1) for row in genres.to_numpy()]
#         genres['distance'] = distances/ np.sum(a = distances)

#         reccs = random.choices(population = list(titles['Title']),
#                        weights    = list(genres['distance']),
#                        k = 5)

#         return reccs, 201
#     return {"error": "Request must be JSON"}, 415