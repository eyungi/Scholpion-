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
        role = self.request.data.get('role')
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

        if (hasattr(user, 'student')):
            role = '학생'
        elif (hasattr(user, 'teacher')):
            role = '선생님'
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

    def get_object_and_serializer(self):
        pk = self.kwargs.get('pk')
        user = get_object_or_404(User, pk=pk)
        if (hasattr(user, 'student')):
            role = '학생'
        elif (hasattr(user, 'teacher')):
            role = '선생님'
        if role == '학생':
            return user.student, StudentSerializer
        elif role == '선생님':
            return user.teacher, TeacherSerializer
        raise ValidationError({"detail": "Invalid user type"})

    def get_object(self):
        instance, _ = self.get_object_and_serializer()
        self.check_object_permissions(self.request, instance)
        return instance

    def get_serializer(self, instance):
        _, serializer_class = self.get_object_and_serializer()
        return serializer_class(instance)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
class ProfileView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    def get_object_and_serializer_class(self):
        user = self.request.user
        if (hasattr(user, 'student')):
            role = '학생'
        elif (hasattr(user, 'teacher')):
            role = '선생님'
        if role == '학생':
            return user.student, StudentSerializer
        elif role == '선생님':
            return user.teacher, TeacherSerializer
        raise ValidationError({"detail": "Invalid user type"})

    def get_object(self):
        instance, _ = self.get_object_and_serializer_class()
        return instance

    def get_serializer_class(self):
        _, serializer_class = self.get_object_and_serializer_class()

        return serializer_class
    
    def update(self, request, *args, **kwargs):
        if 'email' in request.data:
            return Response({"error: 변경할 수 없는 필드를 포함하고 있습니다."}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)