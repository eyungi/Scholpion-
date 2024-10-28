from django.contrib.auth.base_user import BaseUserManager

class UserManager(BaseUserManager):

    def create_user(self, email, name, role, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            role=role,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password):

        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            name=name,
            role="기타",
        )
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user
