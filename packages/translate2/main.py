from waitress import serve
import json
from core.translate import Translate
from utils.constants import FLASK_DEBUG, HOST, PORT, CI
from flask import Flask, request

app = Flask(__name__)


translate = Translate(True)


@app.route('/translate', methods=['POST'])
def translate_handler():
    request_body = request.json
    if request_body is None:
        return "error"
    result = translate.translate(
        text=request_body['q'], from_code=request_body['source'], to_code=request_body['target'])
    return {"translatedText": result}


@app.route('/languages', methods=['GET'])
def get_languages():
    langs = []
    for lang in translate.get_languages():
        langs.append({"name": lang.name, "code": lang.code})
    return langs


@app.route('/check', methods=['GET'])
def check():
    return 'success'


@app.route('/ci', methods=['GET'])
def ci():
    result = "false"
    if CI is True:
        result = "true"
    return result


if FLASK_DEBUG:
    app.run(host=HOST, port=PORT)
else:
    serve(app, host=HOST, port=PORT)
