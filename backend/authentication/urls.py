from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import ObtainTokenPairWithSpotify, HypertrviationUserCreate, GetHypertriviationUser

urlpatterns = [
    path('token/obtain/', ObtainTokenPairWithSpotify.as_view(), name='token_create'),  # override sjwt stock token
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('user/create/', HypertrviationUserCreate.as_view(), name="create_user"),
    path('user/get', GetHypertriviationUser.as_view(), name='get_user')
]