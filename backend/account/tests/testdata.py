from ..factories import StudentFactory, TeacherFactory
from ..models import Teacher, Student
import random

# 테스트용 유저 데이터를 생성하는 함수 (db에 저장x)
# return dictionary data
def create_moke_user_data():
    choice = random.choice([1, 2]) # 선생님과 학생 중 테스트할 모델을 랜덤으로 선택
    if choice == 1:
        user_factory = TeacherFactory
        role = "선생님"
    elif choice == 2:
        user_factory = StudentFactory
        role = "학생"
    user = user_factory.build()
    moke_user = {
        "name": user.name,
        "email": user.email,
        "role": role,
        "password": user.password,
    }
    # 유저 타입에 따라 추가 필드 설정
    if role == '학생':
        moke_user['school'] = user.school
        moke_user['grade'] = user.grade
    elif role == '선생님':
        moke_user['institution'] = user.institution
        moke_user['subject'] = user.subject
    return moke_user

# 테스트용 유저 데이터를 생성하고 저장하는 함수
# return instance
def create_moke_user():
    moke_user_data = create_moke_user_data()
    del moke_user_data['role']
    if 'school' in moke_user_data:
        moke_user = Student(**moke_user_data)
        moke_user.set_password(moke_user.password)
        moke_user.save()
    elif 'institution' in moke_user_data:
        moke_user = Teacher(**moke_user_data)
        moke_user.set_password(moke_user.password)
        moke_user.save()
    return moke_user