from rest_framework import viewsets
from .models import Exam, Prob
from .serializers import ExamSerializer, ProbSerializer
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated

from .permissions import IsTeacherOrOwnerPermission

class ExamView(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrOwnerPermission]

    # creator_id를 추가하여 생성
    def perform_create(self, serializer):
        creator_id = self.request.user.uid
        serializer.save(creator_id=creator_id)

class ProbView(viewsets.ModelViewSet):
    serializer_class = ProbSerializer
    permission_classes = [IsAuthenticated, IsTeacherOrOwnerPermission]

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