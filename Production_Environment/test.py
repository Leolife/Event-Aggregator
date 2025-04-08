import subprocess

if __name__ == '__main__':
    result1 = subprocess.Popen(
    'Production_Environment/Servers/Collectors/Events/Events_run.sh'   , shell=True)

    result2 = subprocess.Popen(
    'Production_Environment/Servers/Collectors/UserBase/UserBase_run.sh', shell=True)