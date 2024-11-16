from rest_framework.test import APITestCase
from ..models import Subject
from .testdata import moke_exam, moke_prob, moke_prob2
from account.tests.testdata import create_moke_user
from rest_framework import status
from copy import deepcopy

class ProbTestCase(APITestCase):
    def setUp(self):
        self.user = create_moke_user()
        while (not hasattr(self.user, 'institution')):
            self.user = create_moke_user()
        self.client.force_authenticate(user=self.user)

        self.moke_prob = deepcopy(moke_prob)
        self.moke_prob2 = deepcopy(moke_prob2)

        # Exam 생성
        Subject.objects.create(subject="영어")
        response = self.client.post('/exams/', moke_exam)

        # Prob 생성
        exam_id = response.data['exam_id']
        response = self.client.post(f'/exams/{exam_id}/problems/', self.moke_prob, format='json') # format 안정해주면 default: form-data

        self.prob_id = response.data['prob_id']
        self.url_probs = f'/exams/{exam_id}/problems/'
        self.url_prob = self.url_probs + self.prob_id + '/'

    def test_get_prob_list(self):
        response = self.client.get(self.url_probs)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_prob(self):
        response = self.client.get(self.url_prob)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['prob_id'], self.prob_id)

    def test_put_prob(self):
        self.moke_prob['question'] = "수정된 문제"
        del self.moke_prob['options'] # options는 수정하려면 option_id 필요
        response = self.client.put(self.url_prob, self.moke_prob, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['question'], "수정된 문제")

    def test_patch_prob(self):
        response = self.client.patch(self.url_prob, {
                "question": "수정된 문제",
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual("수정된 문제", response.data['question'])

    # prob 수정 시 option 삭제, 추가, 수정 가능한지 확인하는 메서드
    def test_patch_prob_with_option(self):
        response = self.client.get(self.url_prob)

        # option 삭제, 추가 테스트
        response = self.client.patch(self.url_prob, {
                "options": [
                    {
                        "option_seq": 3,
                        "option_text": "10"
                    }
                ]
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # 기존 옵션 1, 2 삭제되고 3 추가됨
        option_id = response.data['options'][0]['option_id'] # 추후 옵션 수정을 위해 저장
        del response.data['options'][0]['option_id'] # option_id는 제외하고 비교
        self.assertIn({
            "option_seq": 3,
            "option_text": "10"
        }, response.data['options'])

        # option 수정 테스트
        response = self.client.patch(self.url_prob, {
            "options": [{
                    "option_id": option_id,
                    "option_seq": 4, # 4번으로 수정
                    "option_text": "10"
                }]
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([{
            "option_id": option_id,
            "option_seq": 4,
            "option_text": "10"
        }], response.data['options'])

    def test_delete_prob(self):
        response = self.client.delete(self.url_prob)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # 로그인하지 않은 유저가 문제를 확인하려고 할 때 막히는지 확인하는 메서드
    def test_unauthorized_get(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url_prob)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # 다른 유저가 권한이 없는 시험지에 문제 추가를 시도했을 때 막히는지 확인하는 메서드
    def test_unauthorized_post(self):
        other_user = create_moke_user()
        self.client.force_authenticate(user=other_user)
        response = self.client.post(self.url_probs, self.moke_prob2, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 다른 유저가 권한이 없는 시험지의 문제 수정을 시도했을 때 막히는지 확인하는 메서드
    def test_unauthorized_put(self):
        other_user = create_moke_user()
        self.client.force_authenticate(user=other_user)
        self.moke_prob['question'] = "수정된 문제"
        response = self.client.put(self.url_prob, self.moke_prob, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_patch(self):
        other_user = create_moke_user()
        self.client.force_authenticate(user=other_user)
        response = self.client.put(self.url_prob, {
            "question": "수정된 문제"
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 다른 유저가 권한이 없는 시험지의 문제를 삭제하려고 할 때 막히는지 확인하는 메서드
    def test_unauthorized_delete(self):
        other_user = create_moke_user()
        self.client.force_authenticate(user=other_user)
        response = self.client.delete(self.url_prob)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
