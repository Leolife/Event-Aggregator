export FLASK_APP=RestAPI.py
flask run

# read -p "Press enter to continue"

# # Show old items and links
# python3 -m webbrowser http://127.0.0.1:5000/events

# read -p "Press enter to continue"

# # Request an update by sending the link
# curl -i http://127.0.0.1:5000/events \
# -X POST \
# -H 'Content-Type: application/json' \
# -d '{"link":"https://news.ycombinator.com/"}' 

# read -p "Press enter to continue"

# # Show changes
# python3 -m webbrowser http://127.0.0.1:5000/events

# read -p "Press enter to continue"

# curl http://127.0.0.1:5000/events

# read -p "Press enter to continue"