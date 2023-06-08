"""
URL configuration for magic_django project.

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
from django.urls import path
from . import views

urlpatterns = [
    path('api/hello', views.MyView),
    path('api/register', views.Register),
    path('api/check-authentication', views.CheckUserAuthentication),
    path('api/log-in', views.login_user),
    path('api/log-out', views.logout_user),
    path('admin/', admin.site.urls),
    path('api/exist-user', views.user_profile_verify),
    path('api/save-profile-picture', views.save_profile_picture, name='save_profile_picture'),
    path('api/get-profile-picture', views.get_profile_picture),
    path('api/add-card', views.card_add),
    path('api/get-card', views.get_card),
    path('api/cards', views.cards_list)
]
