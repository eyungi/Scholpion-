from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    if response is None:
        if isinstance(exc, IntegrityError):
            if "UNIQUE constraint failed: account_user.email" in str(exc):
                return Response({"email": "중복된 이메일입니다. 다른 이메일을 입력해주세요.", "status_code": status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": str(exc), "status_code": status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
        if isinstance(exc, ValueError):
            if "ValueError: Invalid user type" in str(exc):
                return Response({"role": "유효하지 않은 role입니다.", "status_code": status.HTTP_400_BAD_REQUEST})
            return Response({'error': str(exc), "status_code": status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
    # Now add the HTTP status code to the response.
    if response is not None:
        response.data['status_code'] = response.status_code

    return response