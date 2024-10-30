from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Teacher, Student
from .serializers import StudentSerializer, TeacherSerializer
from .permissions import IsOwnerOreadOnly
from django.shortcuts import get_object_or_404

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
    
class UserView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsOwnerOreadOnly]

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        role = get_object_or_404(User, pk=pk).role
        if role == '학생':
            return Student
        elif role == '선생님':
            return Teacher
        else:
            raise ValueError("Invalid user role")

    def get_serializer_class(self):
        pk = self.kwargs.get('pk')
        role = get_object_or_404(User, pk=pk).role
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

        # email, role은 변경 불가
        if 'email' in request.data or 'role' in request.data:
            return Response({"error: 변경할 수 없는 필드를 포함하고 있습니다."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({"message: 회원 탈퇴가 완료되었습니다"}, status=status.HTTP_204_NO_CONTENT)
