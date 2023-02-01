import uuid
import json
from time import sleep

from flask import Flask, request
import redis

from settings import REDIS_HOST, REDIS_PORT, REDIS_DB
from models import BlogPost, Summary


app = Flask(__name__)
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)


@app.route("/api/")
def heartbeat():
    return {"message": "Api is running"}


@app.route("/api/posts")
def get_posts():
    limit = request.args.get("limit", 20)
    offset = request.args.get("offset", 0)

    return [post.to_dict() for post in BlogPost.select(
        BlogPost.id, BlogPost.sign, BlogPost.date, BlogPost.brief
    ).offset(offset).limit(limit)]


@app.route("/api/posts/<int:post_id>")
def get_post_by_id(post_id):
    try:
        return BlogPost.get(id=post_id).to_dict()
    except Exception as e:
        return {"message": f"error: {e}"}, 404


@app.route("/api/summaries/", methods=["POST"])
def process_html_to_summary():
    payload = request.get_json()
    trace_id = str(uuid.uuid4())
    html = payload.get("html")
    url = payload.get("url")

    r.lpush("summarization_tasks", json.dumps(
        {
            "id": trace_id,
            "html": html
        }
    ))

    retries = 0
    while retries < 20:
        sleep(1)
        retries += 1
        summary = r.get(trace_id)
        if summary is not None:
            return Summary.create(id=trace_id, html=html, summary=summary.decode(), url=url).to_dict()

    return {"message": "no summary generated, sorry"}


@app.route("/api/summaries/", methods=["GET"])
def get_all_summaries():
    return [s.to_dict() for s in Summary.select()]


@app.route("/api/summaries/<string:summary_id>/", methods=["GET", "DELETE"])
def get_summary_by_id(summary_id):
    try:
        summary = Summary.get(id=summary_id)

        if request.method == "GET":
            return summary.to_dict()
        elif request.method == "DELETE":
            summary.delete_instance()
            return {"message": "deleted successfully!"}
    except Summary.DoesNotExist:
        return {"message": "no summary generated, sorry"}, 404

    return {"message": "no summary generated, sorry"}, 400


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=80)
