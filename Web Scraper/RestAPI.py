#import requests
from flask import Flask, request, jsonify
import pandas as pd
import random
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
    return jsonify(title)

@app.post("/games")
def add_events():
    # if request.is_json:
    #     event_titles_c.items = []
    #     incoming_request = request.get_json()
    #     r = requests.get(url = incoming_request['link'])
    #     soup   = BeautifulSoup(r.content, 'html.parser')
    #     quote  = soup.findAll("a")
    #     quote  = [str(item) for item in quote]
    #     titles = [item for item in quote if item.startswith("<a href=\"https:")][1:-3]

    #     start_idx = len("<a href=\"")
    #     end_idx    = len("</a>")
    #     for idx,t in enumerate(titles):
    #         link, event_title = t[start_idx:-end_idx].split(">")
    #         data_to_append = {"id"   : idx,
    #                           "links": link,
    #                           "title": event_title}
    #         event_titles_c.items.append(data_to_append)
    #         #print(f'{{"id": {idx},"link":"{link} ,"title":"{event_title}"}},')
    #     return event_titles_c.items, 201
    return {"error": "Request must be JSON"}, 415