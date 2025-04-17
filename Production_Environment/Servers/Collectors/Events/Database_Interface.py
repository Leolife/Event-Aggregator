from flask import Flask, request, jsonify
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

########################################## SETUP
events_DB = event_database(FilePath = os.path.join('Data','Event Data.db'))
########################################## Table Management
@app.post("/save_events")
def Incoming_Events():
    """Process the event information coming from the webscrappers"""
    if not request.is_json:
        return {"error": "Request must be JSON"}, 415

    event_listings: list = request.get_json()
    ########################################## Ensure Events are in the proper format
    assert(event_listings != 0)
    sample = event_listings[0]
    # Make sure all the columns we are looking for are in our sample
    for col in events_DB.columns:
        assert(col in sample.keys())
    ##########################################

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

@app.get("/sample")
def get_sample():
    """ """
    r = random.randint(0,100)
    data = events_DB.select_row(row = r)
    return data, 200
    