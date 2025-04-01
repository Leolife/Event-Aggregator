"""
Setups the entire data pipline environemnt
"""
import subprocess
import threading
import random
import time
import sys
import os

def run_cmd(cmd: list[str]) -> str:
    return subprocess.run(cmd, stdout=subprocess.PIPE).stdout.decode('utf-8')

IRed   = "\033[0;91m"
White  = "\033[0;37m"
IGreen = "\033[0;92m"

if __name__ == '__main__':
    items = run_cmd(cmd = ['pip','list'])
    # [2:] removes headers -> [['Package', 'Version'], ['----------------------------', '-----------'] and tail
    libs = [lib.split()[0] for lib in items.split('\n') if len(lib) != 0][2:]
    #########################################################
    #               Validating Libraries                    #
    #########################################################
    with open('requiremnts.txt', mode = 'r') as f:
        required_lib = [lib.strip() for lib in f.readlines()]

    print(f'{"Libraries":<22}{"State":<15}')
    print(f'{"-"*20:<15} {"-"*10:<15}')
    
    for l in required_lib:
        if l in libs:
            print(f'{l:<22}{IGreen}Installed{White}')
        else:
            print(f'{l:<22}{IRed}Missing')
    
    #########################################################
    #               Importing  Libraries                    #
    #########################################################
    from flask       import Flask, request, jsonify
    from load_dotenv import load_dotenv
    from tqdm        import tqdm
    
    #########################################################
    #         Obtain all the working dir                    #
    #########################################################
    assert(len(sys.argv)) == 2
    _, default_path = sys.argv
    # -- Obtain the path for each 
    prod_env = os.path.join(default_path,'Production_Environment')
    server_dir = os.path.join(prod_env,'Server')

    server_list = [os.path.join(server_dir,'db_API.py')]
    #########################################################
    #         Add Environment to working path               #
    #########################################################

    #########################################################
    #                   Running Scripts                     #
    #########################################################
    colors = ["BLACK", "RED", "GREEN", "YELLOW", "BLUE", "MAGENTA", "CYAN", "WHITE"]
    jobs = []
    for idx in tqdm(range(len(server_list)),colour=random.choice(colors)): #hex (#00ff00),
        jobs.append(threading.Thread(target=os.system, 
                                  args = (f'export FLASK_APP={server_list[idx]};flask run -h localhost -p 300{idx}',) ))
    time.sleep(1)
    for thread in jobs:
        thread.start()
    
    for thread in jobs:
        thread.join()
    #########################################################
    #                   Running Scripts                     #
    #########################################################
