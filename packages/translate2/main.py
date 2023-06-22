from waitress import serve
from core.translate import Translate
from utils.constants import FLASK_DEBUG, HOST, PORT
from flask import Flask, request, make_response

app = Flask(__name__)


translate = Translate(True)


@app.route('/translate', methods=['POST'])
def translate_handler():
    request_body = request.json
    if request_body is None:
        return make_response("Request body is None", 400)
    result = translate.translate(
        text=request_body['q'], from_code=request_body['source'], to_code=request_body['target'])
    return make_response({"translatedText": result}, 201)


@app.route('/languages', methods=['GET'])
def get_languages():
    langs = []
    for lang in translate.get_languages():
        langs.append({"name": lang.name, "code": lang.code})
    return make_response(langs, 200)


@app.route('/check', methods=['GET'])
def check():
    return 'success'


if FLASK_DEBUG:
    app.run(host=HOST, port=PORT)
else:
    serve(app, host=HOST, port=PORT)
