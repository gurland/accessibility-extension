import uuid

from flask import Flask, request

from settings import logger
from models import BlogPost, Summary
from utils import process_content_and_get_summary


app = Flask(__name__)


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

    try:
        if url:
            return Summary.get(url=url).to_dict()
        else:
            raise
    except Exception:
        logger.info(f"URL: {url} not found. Sending Task with ID: {trace_id} to summarize")

        summary = process_content_and_get_summary(trace_id, html)
        if summary is not None:
            return Summary.create(id=trace_id, html=html, summary=summary, url=url).to_dict()

    return {"message": "no summary generated, sorry"}


@app.route("/api/summaries/", methods=["GET"])
def get_all_summaries():
    return [s.to_dict() for s in Summary.select().where(Summary.name.is_null(False) & (Summary.name != ""))]


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
