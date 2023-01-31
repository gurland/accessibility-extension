FROM python:3

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY ./src app
WORKDIR app/


CMD ["uwsgi", "--ini", "uwsgi.ini"]
