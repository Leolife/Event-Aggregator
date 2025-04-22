FROM python:3.12

RUN pip install flask
RUN pip install scikit-learn
RUN pip install numpy
RUN pip install requests

ADD Offline_Ranker.py .

CMD ["flask","--app","Offline_Ranker.py","run","--host", "0.0.0.0","--port","5003"]
