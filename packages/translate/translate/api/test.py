from django.http import HttpResponse
from django.http import HttpRequest


def handler(request: HttpRequest):
    return HttpResponse("Testing query string is: %s" % request.GET.get('test'))
