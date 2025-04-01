from tqdm import tqdm
from time import sleep

# [hex (#00ff00), BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE]
for i in tqdm(range(50), colour="MAGENTA"):
    sleep(0.1)

c1 = "\033[32m"
c2 = "\033[31m"
print(f"{c1}ONE")
print(f"{c2}TWO")