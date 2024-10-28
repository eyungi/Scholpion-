import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from .manager import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    uid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    email = models.EmailField(db_index=True, unique=True)
    ROLE_CHOICES = [
        ('선생님', '선생님'),
        ('학생', '학생'),
        ('기타', '기타')
    ]
    role = models.CharField(max_length=3, choices=ROLE_CHOICES, null=False, default="기타")
    name = models.CharField(max_length=100)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )

    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name'] 

    class Meta:
        ordering = ('-date_joined',)

    def __str__(self):
        return self.get_full_name()

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name

class Teacher(User):
    institution = models.CharField(max_length=100, null=True)
    SUBJECT_CHOICES = [
        ('국어', '국어'),
        ('수학', '수학'),
        ('영어', '영어'),
        ('사회', '사회'),
        ('과학', '과학'),
        ('기타', '기타')
    ]
    subject = models.CharField(max_length=2, choices=SUBJECT_CHOICES, null=False)

class Student(User):
    school = models.CharField(max_length=100, null=True)
    GRADE_CHOICES = [
        ('초1', '초등학교 1학년'),
        ('초2', '초등학교 2학년'),
        ('초3', '초등학교 3학년'),
        ('초4', '초등학교 4학년'),
        ('초5', '초등학교 5학년'),
        ('초6', '초등학교 6학년'),
        ('중1', '중학교 1학년'),
        ('중2', '중학교 2학년'),
        ('중3', '중학교 3학년'),
        ('고1', '고등학교 1학년'),
        ('고2', '고등학교 2학년'),
        ('고3', '고등학교 3학년'),
        ('기타', '기타')
    ]
    grade = models.CharField(max_length=2, choices=GRADE_CHOICES, null=False)