from rest_framework.test import APITestCase
from ..models import User
from rest_framework import status
from .testdata import create_moke_user

class ProfileTestCase(APITestCase):
    def setUp(self):
        # 테스트용 유저 생성
        self.moke_user = create_moke_user()
        uid = User.objects.all().get(email=self.moke_user.email).uid
        self.url = f'/users/{uid}/'
        self.client.force_authenticate(user=self.moke_user)

    def test_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # 다른 유저를 생성해서 기존 유저의 정보를 수정할 수 있는지 확인하는 함수
    def test_unauthorized_patch(self):
        other_user = create_moke_user()
        self.client.force_authenticate(user=other_user)
        response = self.client.patch(self.url, {
            "name": "me"
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 다른 유저를 생성해서 기존 유저를 삭제할 수 있는지 확인하는 함수
    def test_unauthorized_delete(self):
        # 기존 유저에 대한 삭제 권한이 없는 다른 유저 생성
        other_user = create_moke_user()
        self.client.force_authenticate(user=other_user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_email(self):
        response = self.client.patch(self.url, {
            "email": "logintest@example.com"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_password(self):
        response = self.client.patch(self.url, {
            "password": "logintest"
        })
        updated_user = User.objects.all().get(email=self.moke_user.email)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual("logintest", updated_user.password)

    def test_patch_role(self):
        response = self.client.patch(self.url, {
            "role": "선생님"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_other_fields(self):
        if self.moke_user.role == "학생":
            response = self.client.patch(self.url, {
                "name": "logintest",
                "school": "동강고",
                "grade": "고2",
            })
            self.assertEqual("동강고", response.data['school'])
            self.assertEqual("고2", response.data['grade'])
        elif self.moke_user.role == "선생님":
            response = self.client.patch(self.url, {
                "name": "logintest",
                "institution": "서강학원",
                "subject": "영어",
            })
            self.assertEqual("서강학원", response.data['institution'])
            self.assertEqual("영어", response.data['subject'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual("logintest", response.data['name'])