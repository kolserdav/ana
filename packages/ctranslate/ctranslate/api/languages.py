from django.http import JsonResponse
from django.http import HttpRequest
from ctranslate.core.translate import Translate

translate = Translate()


def handler(request: HttpRequest):
    langs = []
    for lang in translate.get_languages():
        langs.append({"name": lang.name, "code": lang.code})
    return JsonResponse(langs, safe=False, status=200)
