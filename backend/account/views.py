from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Teacher, Student
from .serializers import StudentSerializer, TeacherSerializer
from .permissions import IsOwnerOreadOnly
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import ValidationError
from faker import Faker
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()

    def get_serializer_class(self):
        role = self.request.data.get('role', "")
        if role == '학생':
            return StudentSerializer
        elif role == '선생님':
            return TeacherSerializer
        raise ValidationError({"detail": "Invalid user type"})

    def create(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)  # JWT 토큰 생성

        if hasattr(user, 'student'):
            role = '학생'
        elif hasattr(user, 'teacher'):
            role = '선생님'
        else:
            role = ""

        # 응답 데이터 구성
        response_data = {
            "message": "회원가입에 성공하였습니다.",
            "user": {
                "email": user.email,
                "name": user.name,
                "role": role
            },
            "token": {
                "access": str(token.access_token),
                "refresh": str(token),
            }
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


class UserView(APIView):
    permission_classes = [IsOwnerOreadOnly]

    def get_object(self):
        user = self.request.user
        if hasattr(user, 'student'):
            instance = user.student
        elif hasattr(user, 'teacher'):
            instance = user.teacher
        else:
            instance = None
        self.check_object_permissions(self.request, instance)
        return instance

    def get_serializer_class(self):
        user = self.request.user
        if hasattr(user, 'student'):
            return StudentSerializer
        elif hasattr(user, 'teacher'):
            return TeacherSerializer
        return None

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(instance)
        return Response(serializer.data)


class ProfileView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if hasattr(user, 'student'):
            instance = user.student
        elif hasattr(user, 'teacher'):
            instance = user.teacher
        else:
            instance = None
        self.check_object_permissions(self.request, instance)
        return instance

    def get_serializer_class(self):
        user = self.request.user
        if hasattr(user, 'student'):
            return StudentSerializer
        elif hasattr(user, 'teacher'):
            return TeacherSerializer
        return None

    def update(self, request, *args, **kwargs):
        if 'email' in request.data:
            return Response({"error: 변경할 수 없는 필드를 포함하고 있습니다."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)