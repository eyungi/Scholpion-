from rest_framework.test import APITestCase
from ..models import User
from rest_framework import status
import random

class UserLoginTestCase(APITestCase):
    def setUp(self):
        self.url = '/users/token/'
        # 회원가입
        choice = random.choice([1, 2]) # 선생님과 학생 중 테스트할 모델을 랜덤으로 선택
        if choice == 1:
            role = "선생님"
        elif choice == 2:
            role = "학생"
        self.user = User.objects.create(
            email="logintest@example.com",
            name="logintest",
            role=role,
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
