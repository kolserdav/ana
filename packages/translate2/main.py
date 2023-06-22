import time
from bottle import route, run, json_dumps, request
import threading
import json
from core.translate import Translate
from utils.constants import DEBUG, HOST, PORT, CI


def parse_body():
    body = json.loads(b"{}")
    for l in request.body:  # type: ignore
        body = json.loads(l)
    return body


translate = Translate(True)


@route('/translate', method='POST')
def translate_handler():
    request_body = parse_body()
    result = translate.translate(
        text=request_body['q'], from_code=request_body['source'], to_code=request_body['target'])
    return json_dumps({"translatedText": result})


@route('/languages', method='GET')
def get_languages():
    langs = []
    for lang in translate.get_languages():
        langs.append({"name": lang.name, "code": lang.code})
    return json_dumps(langs)


@route('/test', method='GET')
def test():
    time.sleep(5)
    return 'success'


@route('/check', method='GET')
def check():
    return 'success'


@route('/ci', method='GET')
def ci():
    result = "false"
    if CI is True:
        result = "true"
    return result


def start_server():
    run(host=HOST, port=PORT, reloader=DEBUG, quiet=DEBUG == False)


threading.Thread(target=start_server).start()
