from waitress import serve
import json
from core.translate import Translate
from utils.constants import FLASK_DEBUG, HOST, PORT, CI
from flask import Flask

app = Flask(__name__)


def parse_body():
    body = json.loads(b"{}")
    for l in request.body:  # type: ignore
        body = json.loads(l)
    return body


translate = Translate(True)


@app.route('/translate', methods=['POST'])
def translate_handler():
    request_body = parse_body()
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
