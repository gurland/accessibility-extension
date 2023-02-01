from typing import Union

from transformers import PegasusForConditionalGeneration, PegasusTokenizer
from bs4 import BeautifulSoup

from settings import logger


_pretrained_model_name = "google/pegasus-xsum"
tokenizer = PegasusTokenizer.from_pretrained(_pretrained_model_name)
model = PegasusForConditionalGeneration.from_pretrained(_pretrained_model_name).to("cpu")


def get_summary(text: str) -> Union[str, None]:
    """
    Runs neural web model to get abstract summary
    """

    try:
        logger.info(f"input text = {text}")

        tokens = tokenizer(text, truncation=True, padding="longest", return_tensors="pt")
        logger.info("tokenized input text")
        prediction = model.generate(**tokens, max_new_tokens=128)
        logger.info("generated model")
        result = tokenizer.decode(prediction[0])
        return result
    except Exception as e:
        logger.error(f"an error occured when was running summarization: {e}")
        return None


def get_summary_from_html(html):
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text()
    logger.info(text)
    summary = get_summary(text)
    clean_summary = BeautifulSoup(summary, "html.parser").get_text()
    return clean_summary
