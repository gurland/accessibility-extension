import redis
import json
from settings import logger, REDIS_HOST, REDIS_PORT, REDIS_DB
from summarizer import get_summary_from_html

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)


def main():
    while True:
        req = r.brpop(["summarization_tasks"], timeout=0)

        req = json.loads(req[1].decode())
        uuid = req["id"]
        html = req["html"]

        logger.debug(f"Got new task with ID: {uuid}.")

        summary = get_summary_from_html(html)
        r.set(uuid, summary)


if __name__ == "__main__":
    logger.info(f"Started summarization service.")
    main()
