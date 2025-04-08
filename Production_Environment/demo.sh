#!/bin/bash
# npm install nodejs
#############################################
# python3 -m webbrowser http://127.0.0.1:5001/shutdown
#############################################
# read -p "Press Enter to Continue"
#############################################
# curl -i http://127.0.0.1:5001/search_idx \
# -X POST \
# -H 'Content-Type: application/json' \
# -d '{"IDX": 20}' 
#############################################


mypath=$(pwd)
cd "/Users/avaldivia/Documents/GitHub/Event-Aggregator/Production_Environment/Servers/Collectors/Events"
# echo $(pwd)
echo "Server 2"
./Events_run.sh &
Server1=$!
cd $mypath
# echo $(pwd)
cd "/Users/avaldivia/Documents/GitHub/Event-Aggregator/Production_Environment/Servers/Collectors/UserBase"
# echo $(pwd)
echo "Server 2"
./UserBase_run.sh &
Server2=$!

echo $Server1
echo $Server2
