import ctranslate2
from django.http import JsonResponse
from django.http import HttpRequest
import json
from ctranslate.core.translate import Translate

translate = Translate()


def handler(request: HttpRequest):
    if request.method != "POST":
        return JsonResponse({"status": 'error', "message": "Method not alowed"})

    request_body = json.loads(request.body.decode('utf-8'))
    print(request_body)
    result = translate.translate(
        text=request_body['q'], from_code=request_body['source'], to_code=request_body['target'])

    return JsonResponse({"translatedText": result})
