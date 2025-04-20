FROM python:3.12

RUN pip install flask

ADD main_server.py .

CMD ["flask","--app","main_server.py","run","--host", "0.0.0.0","--port","5000"]
