#!/bin/bash
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
# export FLASK_APP=RestAPI.py
# flask run

mypath=pwd
python -c "import os; assert(os.getcwd().endswith('Event-Aggregator')) == True"
echo $mypath

if test -d .venv;
then
    echo -e "${GREEN}Virtual Env Exists${NC}"
else
    echo -e "${RED}SCRIPT NOT IN WORKING DIR${NC}"
fi 

# echo $mypath
# cd Server
# export FLASK_APP=db_API.py
# flask run
# cd ..