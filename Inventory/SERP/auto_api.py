from serpapi import SerpApiClient
from dotenv  import load_dotenv

import requests
import time
import json
import gzip
import os

def write_comp_json(data: dict, FileName: str) -> None:
    with gzip.open(FileName, 'w') as fout:
        fout.write(json.dumps(data).encode('utf-8')) 

def read_comp_json(FileName: str) -> None:
    with gzip.open(FileName, 'r') as fin:
        data = json.loads(fin.read().decode('utf-8'))
    return data

def get_next_q(FileName: str) -> str:
    with open(FileName,'r') as f:
        data: list[str] = f.readlines()
    q = data.pop() if len(data) != 0 else 'None'
    with open(FileName,'w') as f:
        f.writelines(data)
    return q.strip()

def main():
    ################################################### Get query 
    q = get_next_q(q_file)
    if q == 'None': # Quit the program if there are no more queries
        exit()
    ###################################################
    query   = {"q": q, "engine": "google_events", 'api_key': API_KEY}
    search = SerpApiClient(query)
    r      = search.get_json()
    #r = read_comp_json(FileName = sample_file)
    ################################################### Log how many results each query got
    try:
        l = len(r['events_results'])
        with open(logs_file,'a') as f:
            f.write(f'Query:{q}; Count: {l}' + '\n')
    except Exception as e:
        with open(logs_file,'a') as f:
            f.write(f'Query: {q}; Error: {e}' + '\n')
        return

    ###################################################
    # Parse r and save
    db = read_comp_json(db_file)
    for e in r['events_results']:
        db[db['COUNT']] = e
        db['COUNT'] += 1
    write_comp_json(data = db, FileName = db_file)
    ###################################################

if __name__ == '__main__': 
    ################################################### Load API Key
    while not os.getcwd().endswith('Event-Aggregator'):
        os.chdir('..')
    load_dotenv(os.path.join(os.getcwd(),'.env'))
    API_KEY = os.environ.get('SERP_API_KEY')
    ###################################################
    Inventory_Path = os.path.join(os.getcwd(),'Inventory')
    SERP_Path      = os.path.join(Inventory_Path,'SERP')
    q_file         = os.path.join(SERP_Path,'queries.txt')
    db_file        = os.path.join(SERP_Path,'db.json')
    logs_file      = os.path.join(SERP_Path,'logs.txt')
    sample_file    = os.path.join(SERP_Path,'api_events.json')
    ###################################################
    while True:
        main()
        time.sleep(10)