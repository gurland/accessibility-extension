import uuid
import json
from time import sleep

from flask import Flask, request
import redis

from settings import REDIS_HOST, REDIS_PORT, REDIS_DB


app = Flask(__name__)
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)


@app.route("/api")
def heartbeat():
    return {"message": "Api is running"}


@app.route("/api/summaries", methods=["POST"])
def process_html_to_summary():
    payload = request.get_json()
    trace_id = str(uuid.uuid4())
    r.lpush("summarization_tasks", json.dumps(
        {
            "id": trace_id,
            "html": payload.get("html")
        }
    ))

    retries = 0
    while retries < 20:
        sleep(1)
        retries += 1
        summary = r.get(trace_id)
        if summary is not None:
            return {"summary": summary}

    return {"message": "no summary generated, sorry"}


@app.route("/api/summaries/<string:summary_id>", methods=["POST"])
def process_html_to_summary(summary_id):
    summary = r.get(summary_id)
    if summary is not None:
        return {"summary": summary}

    return {"message": "no summary generated, sorry"}


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=80)