from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework import serializers
from .models import User, Teacher, Student

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required = True, validators=[UniqueValidator(queryset=User.objects.all())])
    name = serializers.CharField(required = True)
    role = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only = True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('email', 'name', 'role', 'password')

    def validate_role(self, data):
        if (data not in dict(User.ROLE_CHOICES)):
            raise serializers.ValidationError("유효하지 않은 사용자 유형입니다.")
        return data
    
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
        teacher.set_password(validated_data['password'])
        teacher.save()

        return teacher    
    
    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.name = validated_data.get('name', instance.name)
        instance.role = validated_data.get('role', instance.role)
        instance.institution = validated_data.get('institution', instance.institution)
        instance.subject = validated_data.get('subject', instance.subject)
        instance.set_password(validated_data('password'))

        instance.save()
        return instance
    
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
        student.set_password(validated_data['password'])
        student.save()

        return student
    
    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.name = validated_data.get('name', instance.name)
        instance.role = validated_data.get('role', instance.role)
        instance.school = validated_data.get('school', instance.school)
        instance.grade = validated_data.get('grade', instance.grade)
        instance.set_password(validated_data.get('password'))

        instance.save()
        return instance
    
    def validate_grade(self, data):
        if (data not in dict(Student.GRADE_CHOICES)):
            raise serializers.ValidationError("유효하지 않은 학년입니다.")
        return data