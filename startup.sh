#!/bin/bash
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
###################################################
#             Dir in Event-Aggregator             #
###################################################
mypath=$(pwd)
echo Working Dir: $mypath
#read -p "Please make sure that the working directory is in Event Aggregator. Continue? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

###################################################
#                Virtual Env exists               #
###################################################
if test -d .venv;
then
    echo -e "${GREEN}Virtual Env Exists${NC}"
    source .venv/bin/activate
else
    echo -e "${RED}There is no virtual environment currently set up${NC}"
    echo "Please set up a virtual environemtn and title it .venv"
fi 

###################################################
#               Run Setup.py in venv              #
###################################################
python3 setup.py $mypath