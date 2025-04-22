FROM python:3.12

RUN pip install flask
ADD UserBase_API.py .
RUN pip install requests

CMD ["flask","--app","UserBase_API.py","run","--host", "0.0.0.0","--port","5002"]
