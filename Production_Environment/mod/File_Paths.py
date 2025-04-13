import os

def set_default_path(directory: str | None = 'Event-Aggregator') -> str:
    """Changes the working directory to """
    while not os.getcwd().endswith(directory):
        os.chdir('..')
        if len(os.getcwd()) == 0:
            raise FileExistsError
    return os.getcwd()

if __name__ == '__main__':
    default_path = set_default_path()
    default_path = os.path.join(default_path,'Productoin_Environment')

    data_path   = os.path.join(default_path,'Data')
    events_path = os.path.join(data_path,'Final_Events.csv')