"""
Setups the entire data pipline environemnt
"""
import subprocess
import threading
import random
import time
import sys
import os

def set_default_path(directory: str | None = 'Event-Aggregator') -> str:
    """Changes the working directory to """
    while not os.getcwd().endswith(directory):
        os.chdir('..')
        if len(os.getcwd()) == 0:
            raise FileExistsError
    return os.getcwd()

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
        required_libs = [lib.strip() for lib in f.readlines()]

    print(f'{"Libraries":<22}{"State":<15}')
    print(f'{"-"*20:<15} {"-"*10:<15}')
    
    for l in required_libs:
        if l in libs:
            print(f'{l:<22}{IGreen}Installed{White}')
        else:
            print(f'{l:<22}{IRed}Missing{White}')
    
    #########################################################
    #               Importing  Libraries                    #
    #########################################################
    from flask       import Flask, request, jsonify
    from load_dotenv import load_dotenv
    from tqdm        import tqdm
    
    #########################################################
    #               Obtain the working dir                  #
    #########################################################
    #assert(len(sys.argv)) == 2
    #_, default_path = sys.argv
    set_default_path()
    default_path = os.getcwd()
    assert(default_path.endswith('Event-Aggregator'))
    assert(os.path.isdir(default_path))
    # -- Obtain the path for each server
    prod_env       = os.path.join(default_path,'Production_Environment')
    server_dir     = os.path.join(prod_env,'Servers')

    # Under Servers Directory
    collectors_dir = os.path.join(server_dir,'Collectors')

    # Under Collectors Direcrtory
    events_dir   = os.path.join(collectors_dir,'Events'  )
    userbase_dir = os.path.join(collectors_dir,'UserBase')

    # Under Front Direcrtory
    front_dir    = os.path.join(server_dir,'Front Server') 

    # Under Ranker Directory
    ranker_dir  = os.path.join(server_dir,'Ranker' )
    Offline_dir = os.path.join(ranker_dir,'Offline')
    Online_dir  = os.path.join(ranker_dir,'Online' )

    server_list = {
                    'main_server.py': {
                       'DIR' : front_dir,
                       'IP'  : '0.0.0.0',
                       'PORT': '5000'
                        },
                    # Offline Collector
                   'Database_Interface.py': {
                       'DIR' : events_dir,
                       'IP'  : '0.0.0.0',
                       'PORT': '5001'
                        },
                    # Online Collector
                   'UserBase_API.py': {
                       'DIR' : userbase_dir,
                       'IP'  : '0.0.0.0',
                       'PORT': '5002'
                        },
                    'Offline_Ranker.py': {
                       'DIR' : Offline_dir,
                       'IP'  : '0.0.0.0',
                       'PORT': '5003'
                        },
                    'Online_Ranker.py': {
                       'DIR' : Online_dir,
                       'IP'  : '0.0.0.0',
                       'PORT': '5004'
                        }
                   }
    #########################################################
    #         Add Environment to working path               #
    #########################################################

    #########################################################
    #                   Running Scripts                     #
    #########################################################
    colors = ["RED", "GREEN", "YELLOW", "BLUE", "MAGENTA", "CYAN", "WHITE"]
    for (FileName,config) in tqdm((server_list.items()), colour=random.choice(colors) , bar_format='{l_bar}{bar:40}{r_bar}{bar:-40b}'): #hex (#00ff00),
        
        dir_path = config['DIR']
        assert(os.path.isdir(dir_path))
        os.chdir(dir_path)
        ip_address = config['IP']
        port = config['PORT']

        subprocess.Popen([f'export FLASK_APP={FileName}; flask run --host {ip_address} --port {port}'], shell=True)

    # Test
    os.chdir(prod_env)
    time.sleep(6)
    input("Press Enter to Shutdown")
    run_cmd(['python','shutdown.py'])
