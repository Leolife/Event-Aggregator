#!/bin/bash
# export FLASK_APP=RestAPI.py
# flask run

curl -i http://127.0.0.1:5000/events/search \
-X POST \
-H 'Content-Type: application/json' \
-d '{"EVENT":"Super Hot"}' 

echo 
echo

curl -i http://127.0.0.1:5000/events/search \
-X POST \
-H 'Content-Type: application/json' \
-d '{"EVENT":"Something Random That is not in the listings"}' 

exit 1
#################################### Obtain a random event
python3 -m webbrowser http://127.0.0.1:5000/events/random_one
read -p "Press enter to continue"
#################################### Obtain a random set of 3 records
curl -i http://127.0.0.1:5000/events/random \
-X POST \
-H 'Content-Type: application/json' \
-d '{"NUMBER":3}' 

read -p "Press enter to continue"
#################################### Dump the user metric records
python3 -m webbrowser http://127.0.0.1:5000/dump_records
read -p "Press enter to continue"
####################################
curl -i http://127.0.0.1:5000/click/record \
-X POST \
-H 'Content-Type: application/json' \
-d '{"USER_ID": 456,"EVENT": "SuperHot"}' 

read -p "Press enter to continue"
ECHO 'HELLO'
#################################### Dump the user metric records
python3 -m webbrowser http://127.0.0.1:5000/dump_records
read -p "Press enter to continue"
####################################
curl -i http://127.0.0.1:5000/seen/record \
-X POST \
-H 'Content-Type: application/json' \
-d '{"USER_ID":123,"EVENT": "Ratchet & Clank: Rift Apart"}' 

read -p "Press enter to continue"
#################################### Dump the user metric records
python3 -m webbrowser http://127.0.0.1:5000/dump_records
read -p "Press enter to continue"


#################################### Template
# # Request an update by sending the link
# curl -i http://127.0.0.1:5000/games \
# -X POST \
# -H 'Content-Type: application/json' \
# -d '{"Number":"8"}' 
####################################