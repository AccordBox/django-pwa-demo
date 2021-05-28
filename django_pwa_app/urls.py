"""django_pwa_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
import django_pwa_app.views

urlpatterns = [
    path('', django_pwa_app.views.index),
    path('sw.js', django_pwa_app.views.service_worker),
    path('offline/', TemplateView.as_view(template_name="offline.html")),
    path('create-wp-subscription', django_pwa_app.views.AnonymousWebPushDeviceViewSet.as_view({'post': 'create'}),
         name='create-wp-subscription'),
    path('send_notification', django_pwa_app.views.send_notification,
         name='send_notification'),
    path('admin/', admin.site.urls),
]
