import os
from dotenv import load_dotenv
import logging


load_dotenv()

SECRET_KEY: str = os.getenv('SECRET_KEY') or 'SECRET_KEY'

APP_NAME: str = os.getenv('APP_NAME') or 'translate'

DEBUG: bool = os.getenv('DEBUG') == '1'

HOST = os.getenv('HOST') or '127.0.0.1'

PORT = int(os.getenv('PORT') or '8000')

LOG_LEVEL = int(os.getenv('LOG_LEVEL') or '20')

UPDATE_MODELS = os.getenv('UPDATE_MODELS') == '1'

NO_TRANSLATE_MESSAGE = 'No translate'

logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger(APP_NAME)
