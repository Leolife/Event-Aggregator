# How to run Event Aggregator
## Frontend
1. Install node.js [here](https://nodejs.org/en)\
    a. **For MacOS users do the following to install node.js**:
   	- go to https://nodejs.org/en
  	- the website should automatically detect if you are using macOS, etc., otherwise select the correct installer.
	- once the installer downloads, double-click on the .pkg file to run the installer
	- follow the prompts in the installer, accepting the default options
	- now the installation should be complete
2. Clone this Event-Aggregator repository
3. In your files, navigate to the project top level directory, [your path to]/Event-Aggregator
4. Now, navigate to ~/Event-Aggregator/eventaggregator
5. Open a terminal inside of this directory
6. Run `npm install` to install relevant packages, then run `npm update` to ensure they are properly updated
7. Run  `npm start` to start the front end/website
8. DONE SETTING UP FRONT END

Now we must start up the backend using Docker to correctly load data into the front end
## Backend
9. Ensure you have docker desktop installed. [Install Docker for Windows here](https://docs.docker.com/desktop/setup/install/windows-install/), Mac users look below:\
    a. **For MacOS users do the following to install docker**
    - Visit this website: https://docs.docker.com/desktop/setup/install/mac-install/
    - Select the correct installation, most likely it will be "Docker Desktop for Mac with Apple silicon"
    - Open the installed .dmg file
    - Drag and drop docker into applications
    - Open Docker, accept service agreement, then click finish
    - Skip any sections asking about yourself
    - Once Docker starts up, continue with the following steps
10. In your files, navigate to ~/Event-Aggregator/Production_Environment
11. Open terminal in this directory
12. Enter the command `docker compose up --build`
    - If the command does not work, you may have to use sudo, try this command: `sudo docker compose up --build`
13. Now let docker build, this may take 1-2 minutes to complete.
14. DONE SETTING UP BACK END

## Setup Complete
At this point, the website/project should work as intended. If necessary, refresh browser or restart the frontend with `npm start`.
