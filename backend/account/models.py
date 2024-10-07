import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from .manager import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    uid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)
    email = models.EmailField(db_index=True, unique=True)
    name = models.CharField(max_length=100)
    ROLE_CHOICES = [
        ('선생님', '선생님'),
        ('학생', '학생'),
    ]
    role = models.CharField(max_length=4, choices=ROLE_CHOICES, null=True, default='student')
    institution = models.CharField(max_length=100, null=True)
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
