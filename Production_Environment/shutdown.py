import subprocess, signal
import os

def run_cmd(cmd: list[str]) -> str:
    return subprocess.run(cmd, stdout=subprocess.PIPE).stdout.decode('utf-8')

if __name__ == '__main__':
    default_path    = os.getcwd()
    servers_path    = os.path.join(default_path   ,'Servers')
    collectors_path = os.path.join(servers_path   ,'Collectors')
    events_path     = os.path.join(collectors_path,'Events')

    processes = [entry for entry in run_cmd(cmd = ['ps']).split('\n') if '.venv/bin/flask' in entry]
    assert(len(processes)) == 5
    t = [p.split()[0] for p in processes]
    t = list(map(int,t))
    for p in t:
        print(f'Killed Process: {p}')
        os.kill(p,signal.SIGKILL)