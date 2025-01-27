import requests
from flask import Flask, request, jsonify
import pandas as pd
import random
import numpy as np
#from bs4 import BeautifulSoup

app = Flask(__name__)

events_titles = []

class event_listings:
    def __init__(self,i: pd.DataFrame):
        self.data = i
        self.rows,self.cols = i.shape


df = pd.read_csv(filepath_or_buffer = '/Users/andrew/Documents/GitHub/Event-Aggregator/Web Scraper/Data/video_games.csv', index_col = 0)
event_titles_c = event_listings(i = df)

@app.get("/games")
def get_events():
    select_row = random.randint(a = 0, b = event_titles_c.rows)
    title = event_titles_c.data.iloc[select_row,0]
    incoming_request = request.get_json()
    return jsonify(title)

@app.post("/games")
def add_events():
    if request.is_json:
        incoming_request     = request.get_json()
        n = incoming_request['Number']
        random_row = int(n)

        titles = event_titles_c.data[['Title']]
        genres = event_titles_c.data.iloc[:,1:]

        # Select one -> random_row
        t = titles.iloc[random_row]
        g = genres.iloc[random_row].to_numpy()

        titles = titles.drop(index = random_row)
        genres = genres.drop(index = random_row)

        distances = [ np.linalg.norm(x = row - g, ord = 1) for row in genres.to_numpy()]
        genres['distance'] = distances/ np.sum(a = distances)

        reccs = random.choices(population = list(titles['Title']),
                       weights    = list(genres['distance']),
                       k = 5)

        return reccs, 201
    return {"error": "Request must be JSON"}, 415