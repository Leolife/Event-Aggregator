FROM python:3.12

RUN pip install Levenshtein
RUN pip install flask
RUN pip install requests

ADD Database_Interface.py .
# RUN export FLASK_APP=Database_Interface.py
CMD ["flask","--app","Database_Interface.py","run","--host", "0.0.0.0","--port","5001"]
# CMD ["flask", "run", "--host", "0.0.0.0",,"Database_Interface"]
