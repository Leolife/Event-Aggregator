FROM python:3.12

RUN pip install flask firebase-admin

ADD UserData.py .
ADD event-aggregator-service-Account-Key.json .

CMD ["flask", "--app", "UserData.py", "run", "--host", "0.0.0.0", "--port", "5005"]
