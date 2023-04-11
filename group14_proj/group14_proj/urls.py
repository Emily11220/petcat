"""
URL configuration for group14_proj project.
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path, re_path

from group14_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name ='homepage'),
    path('home/', views.home, name ='homepage'),
    path('list/', views.list, name ='list'),
    path('details/<int:id>/', views.details, name = 'details'),
    re_path(r'^details/(?P<id>[1-6]{1})/?$', views.details),
    path('data_model/', views.data_model, name ='data_model'),
]
