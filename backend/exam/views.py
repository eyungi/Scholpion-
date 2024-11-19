from rest_framework import viewsets
from .models import Exam, Prob, SolvedExam, Comment
from .serializers import ExamSerializer, ProbSerializer, SolvedExamSerializer, CommentSerializer
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .permissions import ExamPermission, SolvedExamPermission
from django.db.models import Q

class ExamView(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated, ExamPermission]

    # creator_id를 추가하여 생성
    def perform_create(self, serializer):
        creator_id = self.request.user.uid
        serializer.save(creator_id=creator_id)

class ProbView(viewsets.ModelViewSet):
    serializer_class = ProbSerializer
    permission_classes = [IsAuthenticated, ExamPermission]

    # 해당 exam에 해당하는 문제만 걸러냄
    def get_queryset(self):
        exam_id = self.kwargs['exam_pk']
        # 존재하지 않는 시험지라면 예외처리
        try:
            exam = Exam.objects.get(exam_id=exam_id)
        except Exam.DoesNotExist:
            raise NotFound(detail="시험지를 찾을 수 없습니다.")
        # 존재하는 시험지라면 내보냄
        return Prob.objects.filter(exam=exam)

    # exam_id를 추가하여 생성
    def perform_create(self, serializer):
        exam_id = self.kwargs['exam_pk']
        try:
            exam = Exam.objects.get(exam_id=exam_id)
        except Exam.DoesNotExist:
            raise NotFound(detail="시험지를 찾을 수 없습니다.")
        serializer.save(exam=exam)

class SolvedExamView(viewsets.ModelViewSet):
    queryset = SolvedExam.objects.all()
    serializer_class = SolvedExamSerializer
    permission_classes = [IsAuthenticated, SolvedExamPermission]

    def get_queryset(self):
        if (hasattr(self.request.user, 'student')):
            return SolvedExam.objects.filter(student=self.request.user.student)
        if (hasattr(self.request.user, 'teacher')):
            return SolvedExam.objects.filter(Q(teacher=None) | Q(teacher=self.request.user.teacher))

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # feedback 이외의 필드는 수정 불가
        for key in request.data.keys():
            if key != 'feedback':
                return Response(
                    {"detail": f"'{key}' field is not allowed."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # teacher_id 필드가 비어있으면 요청자의 uid로 설정
        if not instance.teacher:
            request.data['teacher'] = self.request.user

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)

class CommentView(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, SolvedExamPermission]

    def get_queryset(self):
        solved_exam_id = self.kwargs['solved_exam_pk']
        # 존재하지 않는 시험지라면 예외처리
        try:
            solved_exam = SolvedExam.objects.get(solved_exam_id=solved_exam_id)
        except SolvedExam.DoesNotExist:
            raise NotFound(detail="시험지를 찾을 수 없습니다.")
        # 존재하는 시험지라면 내보냄
        return Comment.objects.filter(solved_exam=solved_exam)

    def perform_create(self, serializer):
        solved_exam_id = self.kwargs['solved_exam_pk']
        try:
            solved_exam = SolvedExam.objects.get(solved_exam_id=solved_exam_id)
        except SolvedExam.DoesNotExist:
            raise NotFound(detail="시험지를 찾을 수 없습니다.")
        serializer.save(solved_exam=solved_exam, author = self.request.user)
