FROM python:3.12

RUN pip install flask
RUN pip install sckit-learn
RUN pip install numpy
RUN pip install gzip

ADD Offline_Ranker.py .

CMD ["flask","--app","Offline_Ranker.py","run","--host", "0.0.0.0","--port","5000"]
