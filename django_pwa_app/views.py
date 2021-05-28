from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render

from push_notifications.api.rest_framework import WebPushDeviceViewSet
from push_notifications.models import WebPushDevice
from rest_framework.decorators import api_view


def index(request):
    context = {
        'APPLICATION_SERVER_KEY': settings.PUSH_NOTIFICATIONS_SETTINGS['APP_SERVER_KEY'],
    }
    return render(request, 'index.html', context)


def service_worker(request):
    sw_path = settings.BASE_DIR / "frontend/build" / "sw.js"
    response = HttpResponse(open(sw_path).read(), content_type='application/javascript')
    return response


class AnonymousWebPushDeviceViewSet(WebPushDeviceViewSet):
    def perform_create(self, serializer):
        # if not is_authenticated, can still work
        serializer.save()
        return super().perform_create(serializer)


@api_view(["POST"])
def send_notification(request):
    registration_id = request.data.get('registration_id')
    if registration_id:
        device = WebPushDevice.objects.get(registration_id=registration_id)
        if device:
            device.send_message('Hello World')

    return HttpResponse()
