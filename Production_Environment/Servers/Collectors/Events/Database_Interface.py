from flask import Flask, request, jsonify
from Levenshtein import ratio, jaro, distance
import sqlite3
import random
import os

########################################## Running the Flask App
app = Flask(__name__)
########################################## Events Database 
class event_database:
    def __init__(self, FilePath):
        # Make sure the db and table exists
        self.DATABASE_FILENAME = FilePath
        self.columns = ['TITLE','DATE','MAINPAGE','ADDRESS1','ADDRESS2','WEHN','THUMB','IMAGE','DESC','LongDesc']
        TABLENAME = 'EVENTS'
        try:
            conn      = sqlite3.connect(self.DATABASE_FILENAME)
            cursor    = conn.cursor()
            query     = cursor.execute(f"SELECT count(*) \
                                        FROM sqlite_master \
                                        WHERE type='table' AND name='{TABLENAME}';")
            if not next(query)[0]:
                table = f"""CREATE TABLE {TABLENAME}
                        (
                        ID       INTEGER PRIMARY KEY,
                        TITLE    VARCHAR(255), 
                        DATE     VARCHAR(255), 
                        MAINPAGE TEXT,
                        ADDRESS1 VARCHAR(255),
                        ADDRESS2 VARCHAR(255),
                        WEHN     TEXT,
                        THUMB    TEXT,
                        IMAGE    TEXT,
                        DESC     TEXT,
                        LongDesc TEXT); """
                cursor.execute(table) 
                conn.commit()
        except Exception as e:
            print(e)
        finally:
            conn.close()

    def save_events(self,e: list[tuple]) -> None:
        try:
            conn   = sqlite3.connect(self.DATABASE_FILENAME)
            cursor = conn.cursor()
            # Insert all the values
            for event in e:
                #cursor.execute('''INSERT INTO STUDENT VALUES ('Raju', '7th', 'A')''')
                cursor.execute(
                f"""INSERT INTO EVENTS(TITLE, DATE, MAINPAGE, ADDRESS1, ADDRESS2, WEHN, THUMB, IMAGE, DESC, LongDesc)
                    VALUES {event} """)
            # commit
            conn.commit()
        except Exception as e:
            print(e)
        finally:
            conn.close()
        
    def select_row(self, row) -> tuple:
        try:
            conn   = sqlite3.connect(self.DATABASE_FILENAME)
            cursor = conn.cursor()
            data   = cursor.execute(f'''SELECT * FROM EVENTS LIMIT 1 OFFSET {row}; ''') 
            data   = list(data)
        except Exception as e:
            print(e)
        finally:
            conn.close()
        
        return data

    def select_rows(self, rows) -> tuple:
        assert(type(rows) == tuple)
        try:
            conn   = sqlite3.connect(self.DATABASE_FILENAME)
            cursor = conn.cursor()
            data   = cursor.execute(f'''SELECT * FROM EVENTS WHERE ID in {rows}; ''') 
            data   = list(data)
        except Exception as e:
            print(e)
        finally:
            conn.close()
        
        return data
    
    def print_table(self) -> None:
        try:
            conn   = sqlite3.connect(self.DATABASE_FILENAME)
            cursor = conn.cursor()
            data   = cursor.execute('''SELECT * FROM EVENTS''') 
            for row in data: 
                print(row) 
        except Exception as e:
            print(e)
        finally:
            conn.close()
        
    def clear_table(self) -> None:
        try:
            conn   = sqlite3.connect(self.DATABASE_FILENAME)
            cursor = conn.cursor()
            cursor.execute('''DROP TABLE EVENTS''')
            print('DELETED TABLE')
            conn.commit()
        except Exception as e:
            print(e)
        finally:
            conn.close()
    
    def select_column(self, col: str) -> list:
        try:
            conn   = sqlite3.connect(self.DATABASE_FILENAME)
            cursor = conn.cursor()
            data   = cursor.execute(f'''SELECT {col} FROM EVENTS''') 
            data   = list(data)
        except Exception as e:
            print(e)
        finally:
            conn.close()
        
        return [item[0] for item in data]

    def select_desc(self) -> list:
        try:
            conn   = sqlite3.connect(self.DATABASE_FILENAME)
            cursor = conn.cursor()
            data   = cursor.execute(f'''SELECT ID,DESC FROM EVENTS''') 
            data   = list(data)
        except Exception as e:
            print(e)
        finally:
            conn.close()
        
        return data

    def select_title(self) -> list:
        try:
            conn   = sqlite3.connect(self.DATABASE_FILENAME)
            cursor = conn.cursor()
            data   = cursor.execute(f'''SELECT ID,TITLE FROM EVENTS''') 
            data   = list(data)
        except Exception as e:
            print(e)
        finally:
            conn.close()
        
        return data

########################################## SETUP
events_DB = event_database(FilePath = os.path.join('Data','Event Data.db'))

@app.get("/identify")
def identify():
    print('Events Database')
    return {'Message':'ok'}, 200
########################################## Table Management
@app.post("/save_events")
def Incoming_Events():
    """Process the event information coming from the webscrappers"""
    if not request.is_json:
        return {"error": "Request must be JSON"}, 415

    event_listings: list = request.get_json()
    ##################################### Ensure Events are in the proper format
    assert(event_listings != 0)
    sample = event_listings[0]
    # Make sure all the columns we are looking for are in our sample
    for col in events_DB.columns:
        assert(col in sample.keys())
    #####################################

    """
    ['TITLE','DATE','MAINPAGE',' ADDRESS1','ADDRESS2','WEHN','THUMB','IMAGE','DESC','LongDesc']
    """
    event_listings = [(e['TITLE'],
                       e['DATE'],
                       e['MAINPAGE'],
                       e['ADDRESS1'],
                       e['ADDRESS2'],
                       e['WEHN'],
                       e['THUMB'],
                       e['IMAGE'],
                       e['DESC'],
                       e['LongDesc'],
                       ) for e in event_listings]
    events_DB.save_events(event_listings)
    events_DB.print_table()
    return {'Message': 'ok'}, 200

@app.get("/print_table")
def print_table():
    events_DB.print_table()
    return {'Message': 'ok'}, 200


@app.get("/delete_table1234")
def delete_table():
    events_DB.clear_table()
    return {'Message': 'ok'}, 200
########################################## Table Search
@app.post("/search")
def search_table():
    """ """
    if request.is_json:
        incoming_request = request.get_json()
        n = incoming_request['NUMBER']    
        search_phrase = incoming_request['SEARCH']
    
    event_data: tuple = events_DB.select_title()
    scores  = [(event_id, jaro(search_phrase, title)) for event_id, title in event_data]
    scores = sorted(scores, key = lambda x : x[1],reverse=True)
    event_ids, _ = zip(*scores)
    event_ids = event_ids[:n]

    event_info = events_DB.select_rows(event_ids)
    return event_info, 200


########################################## Data Manipulation
@app.post("/get_col")
def get_col():
    """Process the event information coming from the webscrappers"""
    if request.is_json:
        req = request.get_json()
        col = req['COL'] if 'COL' in req else None
    else:
        return {"error": "Request must be JSON"}, 415
    col_data = events_DB.select_column(col=col)
    return list(col_data), 200

@app.post("/get_rows")
def get_rows():
    """Given a list of selected events, return all the additinoal information"""
    if request.is_json:
        req = request.get_json()
        if 'IDS' not in req:
            return {'Message':'Invalid Request'}, 400
        rows = tuple(req['IDS'])
    else:
        return {"error": "Request must be JSON"}, 415
    col_data = events_DB.select_rows(rows = rows)
    return col_data, 200

@app.get("/sample")
def get_sample():
    """ """
    r = random.randint(0,100)
    data = events_DB.select_row(row = r)
    return data, 200

@app.get("/get_descs")
def get_desc():
    data = events_DB.select_desc()
    return data,200

@app.get("/gett")
def get_title():
    data = events_DB.select_title()
    return data,200
    