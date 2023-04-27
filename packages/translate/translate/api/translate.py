from django.http import JsonResponse
from django.http import HttpRequest
from translate.core.translate import Translate
import json

translate = Translate()


def handler(request: HttpRequest):
    if request.method != "POST":
        return JsonResponse({"status": 'error', "message": "Method not alowed"})

    request_body = json.loads(request.body.decode('utf-8'))
    translatedText = translate.translate(
        request_body['q'], request_body['source'], request_body['target'])
    return JsonResponse({"translatedText": translatedText})
