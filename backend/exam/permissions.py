from rest_framework import permissions
from django.shortcuts import get_object_or_404
from .models import Exam, Prob, SolvedExam

class ExamPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS: # get요청은 허용
            return True
        if view.__class__.__name__ == "ExamView":
            return True
        elif view.__class__.__name__ == "ProbView":
            if request.method == 'POST': # Prob POST 요청은 Exam 생성자만 허용
                exam = get_object_or_404(Exam, exam_id=view.kwargs['exam_pk'])
                return exam.creator.uid == request.user.uid
            return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS: # get요청은 허용
            return True
        if isinstance(obj, Exam):
            return obj.creator.uid == request.user.uid # 객체 말고 uid로 비교해줘야 정상 동작,,
        if isinstance(obj, Prob):
            # print(obj.exam.teacher == request.user) # test할 땐 false인데 postman으로는 true
            return obj.creator.uid == request.user.uid
        
class SolvedExamPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # SolvedExam POST 요청은 학생만 허용
        if view.__class__.__name__ == "SolvedExamView":
            if request.method == 'POST':
                return hasattr(request.user, 'student')
            return True
        # Comment GET, POST 요청은 SolvedExam의 선생님과 학생만 허용
        elif view.__class__.__name__ == "CommentView":
            solved_exam = get_object_or_404(SolvedExam, solved_exam_id=view.kwargs['solved_exam_pk'])
            if solved_exam.student and request.user.student:
                return solved_exam.student.uid == request.user.uid
            elif solved_exam.teacher and request.user.teacher:
                return solved_exam.teacher.uid == request.user.uid
            return False

    def has_object_permission(self, request, view, obj):
        if view.__class__.__name__ == "SolvedExamView":
            if request.method in permissions.SAFE_METHODS:
                return True
            if request.method in ['PUT', 'PATCH']: # SolvedExam의 feedback필드 수정은 선생님만 가능
                if (obj.teacher == None): # 피드백이 할당되지 않은 시험지라면 아무 선생님이나 수정 가능
                    return True
                return obj.teacher.uid == request.user.uid # 피드백이 할당된 시험지라면 해당 선생님만 수정 가능
            if request.method == 'DELETE': # SolvedExam 삭제는 학생만 가능
                return obj.student and obj.student.uid == request.user.uid
        if view.__class__.__name__ == "CommentView": # Comment의 수정, 삭제는 작성자만 가능
            return obj.author and obj.author.uid == request.user.uid