from rest_framework.test import APITestCase
from ..models import Teacher, Student
from rest_framework import status
import random

class UserLoginTestCase(APITestCase):
    def setUp(self):
        self.url = '/users/token/'
        # 회원가입
        choice = random.choice([1, 2]) # 선생님과 학생 중 테스트할 모델을 랜덤으로 선택
        if choice == 1: # 선생님 테스트
            self.user = Teacher.objects.create(
            email="logintest@example.com",
            name="logintest",
            institution="서강고",
            subject="영어"
        )
        elif choice == 2: # 학생 테스트
            self.user = Student.objects.create(
            email="logintest@example.com",
            name="logintest",
            school="서강고",
            grade="고3"
        )
        self.user.set_password("dkssud!!")
        self.user.save()

    def test_successful_login(self):
        user = {
            "email": "logintest@example.com",
            "password": "dkssud!!"
        }
        response = self.client.post(self.url, data=user, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_wrong_password(self):
        user = {
            "email": "logintest@example.com",
            "password": "dkssyd!!"
        }
        response = self.client.post(self.url, data=user, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
