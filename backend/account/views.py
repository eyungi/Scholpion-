from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Teacher, Student
from .serializers import StudentSerializer, TeacherSerializer
from .permissions import IsOwnerOreadOnly
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from faker import Faker

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

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

        # 커스텀 토큰 생성
        token_serializer = CustomTokenObtainPairSerializer(data={'email': user.email, 'password': request.data['password']})
        token_serializer.is_valid(raise_exception=True)
        token = token_serializer.validated_data
        
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
                "access": str(token['access']),
                "refresh": str(token['refresh']),
            }
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
    
class UserView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOreadOnly]

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        user = get_object_or_404(User, pk=pk)
        if (hasattr(user, 'student')):
            role = '학생'
        elif (hasattr(user, 'teacher')):
            role = '선생님'
        if role == '학생':
            return Student
        elif role == '선생님':
            return Teacher
        else:
            raise ValueError("Invalid user role")

    def get_serializer_class(self):
        pk = self.kwargs.get('pk')
        user = get_object_or_404(User, pk=pk)
        if (hasattr(user, 'student')):
            role = '학생'
        elif (hasattr(user, 'teacher')):
            role = '선생님'
        if role == '학생':
            return StudentSerializer
        elif role == '선생님':
            return TeacherSerializer
        else:
            raise ValueError("Invalid user role")
    
    def get(self, request, *args, **kwargs):
            return super().get(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)  # 일부만 수정 허용
        instance = self.get_object()

        # email은 변경 불가
        if 'email' in request.data:
            return Response({"error: 변경할 수 없는 필드를 포함하고 있습니다."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False # DB에서 완전히 삭제하는 대신 접근을 막음

        fake = Faker()
        random_email = fake.email() # 같은 이메일로 재가입 가능하게 랜덤 이메일로 수정
        while (User.objects.filter(email=random_email)):
            random_email = fake.email()
        instance.email = random_email
        instance.set_unusable_password()
        instance.save()
        return Response({"message: 회원 탈퇴가 완료되었습니다"}, status=status.HTTP_204_NO_CONTENT)
