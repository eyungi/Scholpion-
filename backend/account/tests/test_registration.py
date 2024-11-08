from rest_framework.test import APITestCase
from rest_framework import status
from .testdata import create_moke_user_data

class UserRegisterTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.url = '/users/register/'        

    def edit_moke_user(self, **kwargs):
        moke_user = create_moke_user_data()
        moke_user.update(kwargs)
        return moke_user

    def test_successful_registration(self):
        moke_user = self.edit_moke_user()
        response = self.client.post(self.url, data=moke_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_with_missing_email(self):
        moke_user = self.edit_moke_user(email="")
        response = self.client.post(self.url, data=moke_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_duplicate_email(self):
        existing_user = self.edit_moke_user()
        self.client.post(self.url, data=existing_user, format='json')
        new_user = {
            "email": existing_user['email'],
            "name": "name",
            "password": "dkssud!!",
            "role": "학생",
            "school": "서강고", 
            "grade": "고3"
        }
        response = self.client.post(self.url, data=new_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_invalid_email_format(self):
        moke_user = self.edit_moke_user(email='abcemail@')
        response = self.client.post(self.url, data=moke_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_missing_name(self):
        moke_user = self.edit_moke_user(name="")
        response = self.client.post(self.url, data=moke_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_register_with_short_password(self):
        moke_user = self.edit_moke_user(password="a76")
        response = self.client.post(self.url, data=moke_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_unselected_fields(self):
        moke_user = self.edit_moke_user()
        if moke_user["role"] == "선생님":
            moke_user["institution"] = None
            moke_user["subject"] =  None
        elif moke_user["role"] == "학생":
            moke_user["school"] = None
            moke_user["grade"] = None
        response = self.client.post(self.url, data=moke_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_unselected_role(self):
        moke_user = self.edit_moke_user()
        moke_user["role"] = None
        response = self.client.post(self.url, data=moke_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_invalid_role(self):
        moke_user = self.edit_moke_user()
        moke_user["role"] = "아뇨 뚱인데요"
        response = self.client.post(self.url, data=moke_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_no_institution_or_school(self):
        moke_user = self.edit_moke_user()
        if (moke_user["role"] == "선생님"):
            moke_user["institution"] = ""
        elif (moke_user["role"] == "학생"):
            moke_user["school"] = ""
        response = self.client.post(self.url, data=moke_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_with_no_subject_or_grade(self):
        moke_user = self.edit_moke_user()
        if (moke_user["role"] == "선생님"):
            moke_user["subject"] = ""
        elif (moke_user["role"] == "학생"):
            moke_user["grade"] = ""
        response = self.client.post(self.url, data=moke_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_invalid_subject_or_grade(self):
        moke_user = self.edit_moke_user()
        if (moke_user["role"] == "선생님"):
            moke_user["subject"] = "요리"
        elif (moke_user["role"] == "학생"):
            moke_user["grade"] = "대5"
        response = self.client.post(self.url, data=moke_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)