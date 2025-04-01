# # [hex (#00ff00), BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE]
# for i in tqdm(range(50), colour="MAGENTA"):
#     sleep(0.1)

exit(code = 1)

import os
import subprocess

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
    
    for l in required_lib:
        if l in libs:
            print(f'{l:<15}{IGreen}Installed{White}')
        else:
            print(f'{l:<15}{IRed}Missing')
    
    #########################################################
    #               Importing  Libraries                    #
    #########################################################
    from flask       import Flask, request, jsonify
    from load_dotenv import load_dotenv
    from tqdm        import tqdm
    
    #########################################################
    #                   Running Scripts                     #
    #########################################################
    # os.system(command='pwd')

