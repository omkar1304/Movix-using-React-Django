from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, UserChangePasswordSerializer, SendPasswordResetEmailSerializer, UserResetPasswordSerializer, PaymentSerializer
from django.contrib.auth import authenticate
from .renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import Payment, User
from rest_framework.decorators import api_view, renderer_classes


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserRegistration(APIView):

    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=False):
            user = serializer.save()
            payment = Payment.objects.create(email=user.email, isDone=False)
            payment.save();
            token = get_tokens_for_user(user)
            return Response({'token': token, 'Msg': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)


class UserLogin(APIView):

    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=False):
            email = serializer.data.get('email')
            password = serializer.data.get('password')

            user = authenticate(email=email, password=password)
            if user is not None:
                token = get_tokens_for_user(user)
                return Response({'token': token, 'Msg': serializer.data})
            else:
                return Response({'errors': {'non_field_errors': ['Email or Password is not Valid']}})

        return Response(serializer.errors)


class UserProfile(APIView):

    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class PaymentView(APIView):

#     renderer_classes = [UserRenderer]

#     def post(self, request, format=None):
#         email = request.data['email']
#         isDone = request.data['isDone']

#         serializer = PaymentSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=False):
#             payment = Payment.objects.create(email=email, isDone=isDone)
#             payment.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors)


@api_view(['GET'])
@renderer_classes([UserRenderer])
def paymentGet(request, pk):
    try:
        payment = Payment.objects.get(email=pk)
        serializer = PaymentSerializer(payment, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'accountError': "Account doesn't exists"})
    
@api_view(['PUT'])
@renderer_classes([UserRenderer])
def paymentUpdate(request, pk):
    payment = Payment.objects.get(email=pk)
    serializer = PaymentSerializer(instance=payment, data={"email": pk, "isDone": True})
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)



class UserChangePassword(APIView):

    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(
            data=request.data, context={'user': request.user})
        if serializer.is_valid(raise_exception=False):
            return Response({'msg': 'Password Changed Successfully'})

        return Response(serializer.errors)


class SendPasswordResetEmail(APIView):

    renderer_classes = [UserRenderer]

    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid(raise_exception=False):
            return Response({'msg': 'Password reset link has been sent. Please check your mail'})
        return Response(serializer.errors)


class UserResetPassword(APIView):

    renderer_classes = [UserRenderer]

    def post(self, request, uid, token, format=None):
        serializer = UserResetPasswordSerializer(
            data=request.data, context={'uid': uid, 'token': token})
        if serializer.is_valid(raise_exception=False):
            return Response({'msg': 'Password has been reset successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors)
