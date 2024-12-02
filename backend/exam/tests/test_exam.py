from rest_framework.test import APITestCase
from account.tests.testdata import create_moke_user
from rest_framework import status
from .testdata import moke_exam

class ExamTestCase(APITestCase):
    def setUp(self):
        self.user = create_moke_user()
        while (not hasattr(self.user, 'institution')):
            self.user = create_moke_user()
        self.client.force_authenticate(user=self.user)

        response = self.client.post('/exams/', moke_exam)
        self.exam_id = response.data['exam_id']
        self.url = f'/exams/{self.exam_id}/'

    def test_get_exam_list(self):
        response = self.client.get('/exams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_exam(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['exam_id'], self.exam_id)

    def test_put_exam(self):
        response = self.client.patch(self.url, {
                "exam_name": "수정된 시험지",
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual("수정된 시험지", response.data['exam_name'])

    def test_patch_exam(self):
        response = self.client.patch(self.url, {
                "exam_name": "수정된 시험지",
            })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual("수정된 시험지", response.data['exam_name'])

    def test_delete_exam(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # 다른 유저가 시험지를 수정하려고 할 때 막히는지 확인하는 메서드
    def test_unauthorized_put(self):
        other_user = create_moke_user() # 기존 시험지에 대한 삭제 권한이 없는 다른 유저 생성
        self.client.force_authenticate(user=other_user)
        response = self.client.patch(self.url, {
                "exam_name": "수정된 시험지",
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_patch(self):
        other_user = create_moke_user()
        self.client.force_authenticate(user=other_user)
        response = self.client.patch(self.url, {
                "exam_name": "수정된 시험지",
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 다른 유저가 시험지를 삭제하려고 할 때 막히는지 확인하는 메서드
    def test_unauthorized_delete(self):
        other_user = create_moke_user()
        self.client.force_authenticate(user=other_user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 로그인하지 않은 유저가 시험지를 확인하려고 할 때 막히는지 확인하는 메서드
    def test_unauthorized_get(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
