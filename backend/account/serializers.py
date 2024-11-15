from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from .models import User, Teacher, Student

# serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required = True, validators=[UniqueValidator(queryset=User.objects.all())])
    name = serializers.CharField(required = True)
    password = serializers.CharField(required=True, write_only = True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('email', 'name', 'password')

    def update(self, instance, validated_data):
        for key, value in validated_data.items():
            if key == 'password':
                if value:
                    instance.set_password(value)  # request에 비밀번호가 있을 때만 해싱하여 저장
            else:
                setattr(instance, key, value)
        instance.save()
        return instance
    
class TeacherSerializer(UserSerializer):
    subject = serializers.CharField(required=True)
    institution = serializers.CharField(required=True, allow_blank=True)

    class Meta(UserSerializer.Meta):
        model = Teacher
        fields = UserSerializer.Meta.fields + ('institution', 'subject')

    def create(self, validated_data):
        teacher = Teacher.objects.create(
            email = validated_data['email'],
            name = validated_data['name'],
            institution = validated_data['institution'],
            subject = validated_data['subject']
        )
        teacher.set_password(validated_data['password'])
        teacher.save()

        return teacher    
    
    def validate_subject(self, data):
        if (data not in dict(Teacher.SUBJECT_CHOICES)):
            raise serializers.ValidationError("유효하지 않은 과목입니다.")
        return data

class StudentSerializer(UserSerializer):
    school = serializers.CharField(required=True, allow_blank=True)
    grade = serializers.CharField(required=True)

    class Meta(UserSerializer.Meta):
        model = Student
        fields = UserSerializer.Meta.fields + ('school', 'grade')

    def create(self, validated_data):
        student = Student.objects.create(
            email = validated_data['email'],
            name = validated_data['name'],
            school=validated_data['school'],
            grade=validated_data['grade']
        )
        student.set_password(validated_data['password'])
        student.save()

        return student
    
    def validate_grade(self, data):
        if (data not in dict(Student.GRADE_CHOICES)):
            raise serializers.ValidationError("유효하지 않은 학년입니다.")
        return data