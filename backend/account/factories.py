import factory
from .models import Student, Teacher

# 추상클래스 UserFactory
class BaseUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        abstract = True

    name = factory.Faker('name')
    email = factory.lazy_attribute(lambda u: f"{u.name.split()[0]}@example.com")
    password = factory.Faker('password')

# UserFactory를 상속하는 StudentFactory
class StudentFactory(BaseUserFactory):
    class Meta:
        model = Student

    school = factory.Faker('name')
    grade = factory.Iterator(['초1', '중2', '고3', '기타'])

# UserFactory를 상속하는 TeacherFactory
class TeacherFactory(BaseUserFactory):
    class Meta:
        model = Teacher

    institution = factory.Faker('name')
    subject = factory.Iterator(['국어', '수학', '영어', '사회', '과학', '기타'])