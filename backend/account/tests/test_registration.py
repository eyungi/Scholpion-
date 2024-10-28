from rest_framework.test import APITestCase
from ..factories import StudentFactory, TeacherFactory
from rest_framework import status
import random

class UserRegisterTestCase(APITestCase):
    def setUp(self):
        self.url = '/users/register/'

    def create_user_data(self, **kwargs):
        choice = random.choice([1, 2]) # 선생님과 학생 중 테스트할 모델을 랜덤으로 선택
        if choice == 1:
            user_factory = TeacherFactory
            role = "선생님"
        elif choice == 2:
            user_factory = StudentFactory
            role = "학생"
        user = user_factory.build() # db에 저장되지 않게 설정
        data = {
            "name": user.name,
            "email": user.email,
            "role": role,
            "password": user.password,
            "password2": user.password,
        }
        # 유저 타입에 따라 추가 필드 설정
        if role == '학생':
            data['school'] = user.school
            data['grade'] = user.grade
        elif role == '선생님':
            data['institution'] = user.institution
            data['subject'] = user.subject
        data.update(kwargs)
        return data

    def test_successful_registration(self):
        data = self.create_user_data()
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_with_missing_email(self):
        data = self.create_user_data(email="")
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_duplicate_email(self):
        existing_user = self.create_user_data()
        self.client.post(self.url, data=existing_user, format='json')
        new_user = {
            "email": existing_user['email'],
            "name": "name",
            "password": "dkssud!!",
            "password2": "dkssud!!",
            "role": "학생",
            "school": "서강고", 
            "grade": "고3"
        }
        response = self.client.post(self.url, data=new_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_invalid_email_format(self):
        data = self.create_user_data(email='abcemail@')
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_missing_name(self):
        data = self.create_user_data(name="")
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_register_with_short_password(self):
        data = self.create_user_data(password="a76", password2="a76")
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_mismatched_passwords(self):
        data = self.create_user_data(password="dkssud!!", password2="dkssyd!!")
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_unselected_fields(self):
        data = self.create_user_data()
        if data["role"] == "선생님":
            data["institution"] = None
            data["subject"] =  None
        elif data["role"] == "학생":
            data["school"] = None
            data["grade"] = None
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_unselected_role(self):
        data = self.create_user_data()
        data["role"] = None
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_invalid_role(self):
        data = self.create_user_data()
        data["role"] = "아뇨 뚱인데요"
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_no_institution_or_school(self):
        data = self.create_user_data()
        if (data["role"] == "선생님"):
            data["institution"] = ""
        elif (data["role"] == "학생"):
            data["school"] = ""
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_with_no_subject_or_grade(self):
        data = self.create_user_data()
        if (data["role"] == "선생님"):
            data["subject"] = ""
        elif (data["role"] == "학생"):
            data["grade"] = ""
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_invalid_subject_or_grade(self):
        data = self.create_user_data()
        if (data["role"] == "선생님"):
            data["subject"] = "요리"
        elif (data["role"] == "학생"):
            data["grade"] = "대5"
        response = self.client.post(self.url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)