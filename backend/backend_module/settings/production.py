import os

from .base import *

SECRET_KEY = os.environ['SECRET_KEY']

DEBUG = False

ALLOWED_HOSTS = [
    "api.scholpion.com"
]

DATABASES['default'] = {
    'ENGINE': 'django.db.backends.postgresql',
    'NAME': os.environ['DB_NAME'],
    'HOST': os.environ['DB_HOST'],
    'USER': os.environ['DB_USER'],
    'PASSWORD': os.environ['DB_PASSWORD'],
    'PORT': os.environ['DB_PORT'],
}

WSGI_APPLICATION = 'backend_module.wsgi.production.application'

CORS_ALLOWED_ORIGINS = [
    "https://scholpion.com",
]
CORS_ALLOW_CREDENTIALS = True
CORS_REPLACE_HTTPS_REFERER = True

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
CSRF_TRUSTED_ORIGINS = [
    "https://scholpion.com",
]
CSRF_COOKIE_DOMAIN = "scholpion.com"
