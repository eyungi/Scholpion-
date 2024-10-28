from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from .models import User, Teacher, Student

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required = True, validators=[UniqueValidator(queryset=User.objects.all())])
    name = serializers.CharField(required = True)
    role = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only = True, validators=[validate_password])
    password2 = serializers.CharField(required=True, write_only = True)

    class Meta:
        model = User
        fields = ('email', 'name', 'role', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({
                "password" : "Password fields didn't match"
            })
        
        return data

    def validate_role(self, data):
        if (data not in dict(User.ROLE_CHOICES)):
            raise serializers.ValidationError("유효하지 않은 사용자 유형입니다.")
        return data

    def create(self, validated_data):
        user = User.objects.create(
            email = validated_data['email'],
            name = validated_data['name'],
            role = validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
    
        return user
    
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
            role = validated_data['role'],
            institution = validated_data['institution'],
            subject = validated_data['subject']
        )
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
            role = validated_data['role'],
            school=validated_data['school'],
            grade=validated_data['grade']
        )
        student.save()

        return student
    
    def validate_grade(self, data):
        if (data not in dict(Student.GRADE_CHOICES)):
            raise serializers.ValidationError("유효하지 않은 학년입니다.")
        return data