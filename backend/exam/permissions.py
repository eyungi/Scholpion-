from rest_framework import permissions
from .models import Exam, Prob

class IsTeacherOrOwnerPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Exam POST 요청은 선생님만 허용
        if view.__class__.__name__ == "ExamView":
            if request.method == 'POST':
                return hasattr(request.user, 'teacher')
            # Exam, Category GET 요청은 모두 허용
            return True
        # Prob POST 요청은 Exam 생성자만 허용
        elif view.__class__.__name__ == "ProbView":
            if request.method == 'POST':
                exam = Exam.objects.get(exam_id=view.kwargs['exam_pk'])
                return exam.creator.uid == request.user.uid
            # Prob GET 요청은 모두 허용
            return True
            
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS: # get요청은 허용
            return True
        if isinstance(obj, Exam):
            return obj.creator.uid == request.user.uid # 객체 말고 uid로 비교해줘야 정상 동작,,
        if isinstance(obj, Prob):
            # print(obj.exam.teacher == request.user) # test할 땐 false인데 postman으로는 true네
            return obj.exam.creator.uid == request.user.uid