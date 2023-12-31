from django.urls import path
from account.views import UserRegistration, UserLogin, UserProfile, UserChangePassword, SendPasswordResetEmail, UserResetPassword,paymentGet, paymentUpdate

urlpatterns = [
    path('register/', UserRegistration.as_view(), name='register'),
    path('login/', UserLogin.as_view(), name='login'),
    path('profile/', UserProfile.as_view(), name='profile'),
    path('payment-get/<str:pk>/', paymentGet, name='payment-get'),
    path('payment-update/<str:pk>/', paymentUpdate, name='payment-update'),
    path('change-password/', UserChangePassword.as_view(), name='change-password'),
    path('send-password-reset-email/', SendPasswordResetEmail.as_view(), name='send-password-reset-email'),
    path('reset-password/<uid>/<token>/', UserResetPassword.as_view(), name='reset-password'),

]