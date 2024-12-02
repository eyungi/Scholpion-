from rest_framework import viewsets
from .models import Exam, Prob, SolvedExam, Comment, ExamProb
from .serializers import ExamSerializer, ProbSerializer, SolvedExamSerializer, CommentSerializer
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .permissions import ExamPermission, SolvedExamPermission
from django.db.models import Q
from .services import get_recommended_probs

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

    # 시리얼라이저로 exam_pk 넘겨줌
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['exam_pk'] = self.kwargs.get('exam_pk')
        return context

    # 해당 exam에 해당하는 문제만 걸러냄
    def get_queryset(self):
        exam_id = self.kwargs['exam_pk']
        # 존재하지 않는 시험지라면 예외처리
        try:
            exam = Exam.objects.get(exam_id=exam_id)
        except Exam.DoesNotExist:
            raise NotFound(detail="시험지를 찾을 수 없습니다.")
        # 존재하는 시험지라면 내보냄
        return Prob.objects.filter(examprob__exam=exam)

    # exam_id를 추가하여 생성
    def perform_create(self, serializer):
        exam_id = self.kwargs['exam_pk']
        try:
            exam = Exam.objects.get(exam_id=exam_id)
        except Exam.DoesNotExist:
            raise NotFound(detail="시험지를 찾을 수 없습니다.")
        prob = serializer.save()
        prob.exams.add(exam)

class SolvedExamView(viewsets.ModelViewSet):
    queryset = SolvedExam.objects.all()
    serializer_class = SolvedExamSerializer
    permission_classes = [IsAuthenticated, SolvedExamPermission]

    def get_queryset(self):
        if (hasattr(self.request.user, 'student')):
            return SolvedExam.objects.filter(student=self.request.user.student)
        if (hasattr(self.request.user, 'teacher')):
            return SolvedExam.objects.filter(Q(teacher=None) | Q(teacher=self.request.user.teacher))

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serialized_data = serializer.data

        # 응답에 기존 문제의 정답을 추가해서 내보냄
        solved_problem_ids = [solved_problem['prob'] for solved_problem in serializer.data['problems']] # 푼 문제의 id를 한번에 뽑아냄
        answers = Prob.objects.filter(prob_id__in=solved_problem_ids).values('prob_id', 'answer') # 푼 문제의 id와 답을 한번에 가져옴
        answers_dict = {item['prob_id']: item['answer'] for item in answers} # 사전 형태로 저장

        for problem in serialized_data['problems']:
            prob_id = problem['prob']
            problem['answer'] = answers_dict[prob_id]

        return Response(serialized_data)

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

class RecommendedExamView(viewsets.ModelViewSet): 
    queryset = Exam.objects.filter(is_recommended=True)
    serializer_class = ExamSerializer

    # put, patch 메서드 제한
    http_method_names = ['get', 'post', 'delete']

    def create(self, request, *args, **kwargs):
        category_name = request.data.get('category_name', None)

        if not category_name:
            return Response({"detail": "카테고리를 입력해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        # 추천 문제를 선택하는 서비스 함수 호출
        probs = get_recommended_probs(request.user, category_name)

        # 선택된 문제가 충분하지 않은 경우 에러 반환
        if len(probs) < 5:
            return Response({"detail": "추천 가능한 문제가 부족합니다."}, status=status.HTTP_400_BAD_REQUEST)

        # 추천 시험지 생성
        recommended_exam = Exam.objects.create(
            exam_name=f"{category_name} 추천시험지",
            creator=request.user,
            is_recommended=True
        )
        for index, prob in enumerate(probs, start=1):
            ExamProb.objects.create(
                exam=recommended_exam,
                prob=prob,
                prob_seq=index
            )

        # 직렬화 및 응답
        serializer = self.get_serializer(recommended_exam)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
