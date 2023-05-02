import os

SECRET_KEY: str = os.getenv('SECRET_KEY') or 'SECRET_KEY'

DEBUG: bool = os.getenv('DEBUG') == '1'

ALLOWED_HOSTS = (os.getenv('ALLOWED_HOSTS') or '127.0.0.1').split(',')

UPDATE_MODELS = os.getenv('UPDATE_MODELS') == '1'

NO_TRANSLATE_MESSAGE = 'No translate'
