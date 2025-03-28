from rest_framework.test import APITestCase
from ..models import User
from rest_framework import status
from .testdata import create_moke_user

class ProfileTestCase(APITestCase):
    def setUp(self):
        # 테스트용 유저 생성
        self.moke_user = create_moke_user()
        uid = User.objects.get(email=self.moke_user.email).uid
        self.url_me = f'/users/me/'
        self.url_user = f'/users/{uid}/'
        self.client.force_authenticate(user=self.moke_user)

    def test_get(self):
        response = self.client.get(self.url_me)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_email(self):
        response = self.client.patch(self.url_me, {
            "email": "logintest@example.com"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_password(self):
        response = self.client.patch(self.url_me, {
            "password": "logintest"
        })
        updated_user = User.objects.get(email=self.moke_user.email)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual("logintest", updated_user.password)

    # 다른 유저를 생성해서 기존 유저의 정보를 수정할 수 있는지 확인하는 함수
    def test_unauthorized_patch(self):
        other_user = create_moke_user()
        self.client.force_authenticate(user=other_user)
        response = self.client.patch(self.url_user, {
            "name": "me"
        })
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    # 다른 유저를 생성해서 기존 유저를 삭제할 수 있는지 확인하는 함수
    def test_unauthorized_delete(self):
        # 기존 유저에 대한 삭제 권한이 없는 다른 유저 생성
        other_user = create_moke_user()
        self.client.force_authenticate(user=other_user)
        response = self.client.delete(self.url_user)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_patch_other_fields(self):
        if hasattr(self.moke_user, 'school'):
            response = self.client.patch(self.url_me, {
                "name": "logintest",
                "school": "동강고",
                "grade": "고2",
            })
            self.assertEqual("동강고", response.data['school'])
            self.assertEqual("고2", response.data['grade'])
        elif hasattr(self.moke_user, 'institution'):
            response = self.client.patch(self.url_me, {
                "name": "logintest",
                "institution": "서강학원",
                "subject": "영어",
            })
            self.assertEqual("서강학원", response.data['institution'])
            self.assertEqual("영어", response.data['subject'])

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual("logintest", response.data['name'])