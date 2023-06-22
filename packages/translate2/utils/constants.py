import os
from dotenv import load_dotenv
import logging


load_dotenv()

CI: bool = os.getenv('CI') == 'true' or False
print(CI, os.getenv('CI'))

SECRET_KEY: str = os.getenv('SECRET_KEY') or 'SECRET_KEY'

APP_NAME: str = os.getenv('APP_NAME') or 'translate'

FLASK_DEBUG: bool = os.getenv('FLASK_DEBUG') == '1'

HOST = os.getenv('HOST') or '127.0.0.1'

PORT = int(os.getenv('PORT') or '8000')

LOG_LEVEL = int(os.getenv('LOG_LEVEL') or '20')

NO_TRANSLATE_MESSAGE = 'No translate'

# deps packages/app/utils/constants.ts LEARN_LANG_DEFAULT
LEARN_LANG_DEFAULT = 'en'
# deps packages/app/utils/constants.ts NATIVE_LANG_DEFAULT
NATIVE_LANG_DEFAULT = 'ru'

# Range(1 - 4)
NUM_HYPOTHESES = 1

logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger(APP_NAME)
