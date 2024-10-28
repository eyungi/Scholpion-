from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import StudentSerializer, TeacherSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    def get_serializer_class(self):
        role = self.request.data.get('role')
        if role == '학생':
            return StudentSerializer
        elif role == '선생님':
            return TeacherSerializer
        raise ValueError("Invalid user type")

    def create(self, request, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)  # JWT 토큰 생성

        # 응답 데이터 구성
        response_data = {
            "message": "회원가입에 성공하였습니다.",
            "user": {
                "email": user.email,
                "name": user.name,
                "role": user.role,
            },
            "token": {
                "access": str(token.access_token),
                "refresh": str(token),
            }
        }

        return Response(response_data, status=status.HTTP_201_CREATED)