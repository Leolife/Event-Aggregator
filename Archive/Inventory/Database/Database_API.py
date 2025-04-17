from flask import Flask, request, jsonify
import sqlite3

########################################## Running the Flask App
app = Flask(__name__)
########################################## Events Database 
class event_database:
    def __init__(self):
        # Make sure the db and table exists
        self.DATABASE_FILENAME = 'Event Data.db'
        TABLENAME = 'EVENTS'
        try:
            conn      = sqlite3.connect(self.DATABASE_FILENAME)
            cursor    = conn.cursor()
            query     = cursor.execute(f"SELECT count(*) \
                                        FROM sqlite_master \
                                        WHERE type='table' AND name='{TABLENAME}';")
            if not next(query)[0]:
                table = f"""CREATE TABLE {TABLENAME}
                        (TITLE   VARCHAR(255), 
                        DATE     VARCHAR(255), 
                        LOCATION VARCHAR(255));"""
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
                cursor.execute(f"""INSERT INTO EVENTS VALUES {event} """)
            # commit
            conn.commit()
        except Exception as e:
            print(e)
        finally:
            conn.close()
    
    def print_table(self) -> None:
        try:
            conn   = sqlite3.connect(self.DATABASE_FILENAME)
            cursor = conn.cursor()
            data   = cursor.execute('''SELECT * FROM EVENTS''') 
            print('ALL EVENTS THAT ARE IN THE TABLE')
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


########################################## SETUP
events_DB = event_database()
##########################################
@app.post("/events/save")
def Incoming_Events():
    """Process the event information coming from the webscrappers"""
    if not request.is_json:
        return {"error": "Request must be JSON"}, 415

    event_listings: list = request.get_json()
    event_listings = [(v['TITLE'],v['DATE'],v['LOCATION']) for v in event_listings]
    events_DB.save_events(event_listings)
    events_DB.print_table()
    events_DB.clear_table()
    return {'Message': 'ok'}, 200

@app.post("/search")
def Incoming_Events():
    """Process the event information coming from the webscrappers"""
    if not request.is_json:
        return {"error": "Request must be JSON"}, 415

    event_listings: list = request.get_json()
    event_listings = [(v['TITLE'],v['DATE'],v['LOCATION']) for v in event_listings]
    events_DB.save_events(event_listings)
    events_DB.print_table()
    events_DB.clear_table()
    return {'Message': 'ok'}, 200