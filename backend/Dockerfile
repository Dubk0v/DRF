 FROM python:3.8.6

RUN pip3 install --upgrade pip3
COPY ./ ./
RUN pip install -r requirements.txt
RUN pip install gunicorn