#!/bin/bash
# export FLASK_APP=RestAPI.py
# flask run
# npm install nodejs


curl -i http://127.0.0.1:5000/post/upvote \
-X POST \
-H 'Content-Type: application/json' \
-d '{"USER_ID":"SampleEmailgmail.com","POST":"001"}' 

python3 -m webbrowser http://127.0.0.1:5000/dump_records
read -p "Press enter to continue"

curl -i http://127.0.0.1:5000/post/downvote \
-X POST \
-H 'Content-Type: application/json' \
-d '{"USER_ID":"SampleEmailgmail.com","POST":"002"}' 

python3 -m webbrowser http://127.0.0.1:5000/dump_records
read -p "Press enter to continue"