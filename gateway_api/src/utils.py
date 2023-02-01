import json
from time import sleep
from typing import Union

import redis

from settings import REDIS_HOST, REDIS_PORT, REDIS_DB, logger

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)


def process_content_and_get_summary(trace_id: str, content: str) -> Union[str, None]:
    summarization_task = json.dumps({
        "id": trace_id,
        "html": content
    })

    logger.debug(f"Pushing summarization task: {summarization_task}")
    r.lpush("summarization_tasks", summarization_task)

    retries = 0
    while retries < 20:
        sleep(1)
        retries += 1
        result = r.get(trace_id)
        if result is not None:
            return result.decode()
