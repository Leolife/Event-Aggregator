#!/bin/bash
# npm install nodejs
#############################################
#python3 -m webbrowser http://127.0.0.1:5000/get_features
#############################################
# read -p "Press Enter to Continue"
#############################################
curl -i http://127.0.0.1:5001/search_idx \
-X POST \
-H 'Content-Type: application/json' \
-d '{"IDX": 20}' 
#############################################