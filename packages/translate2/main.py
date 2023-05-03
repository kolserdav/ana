from bottle import route, run, json_dumps, request
import json
from core.translate import Translate
from utils.constants import DEBUG, HOST, PORT


def parse_body():
    body = json.loads(b"{}")
    for l in request.body:  # type: ignore
        body = json.loads(l)
    return body


translate = Translate()


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


run(host=HOST, port=PORT, reloader=DEBUG, quiet=DEBUG == False)
