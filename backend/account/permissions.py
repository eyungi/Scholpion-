from rest_framework import permissions
from rest_framework.exceptions import ValidationError

class IsOwnerOreadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if (hasattr(request.user, 'student')):
            return obj == request.user.student
        elif (hasattr(request.user, 'teacher')):
            return obj == request.user.teacher
        else:
            raise ValidationError("유효하지 않은 사용자 유형입니다.")