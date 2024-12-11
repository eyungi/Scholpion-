from rest_framework import serializers
from rest_framework.exceptions import APIException
from drf_writable_nested import WritableNestedModelSerializer
from .models import Category, Option, Prob, Exam, ExamProb, SolvedProb, SolvedExam, Comment
from account.models import User, Teacher, Student
from django.db import transaction


# 카테고리 시리얼라이저
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


# 선지 시리얼라이저
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ('option_id', 'option_seq', 'option_text')


# 문제 시리얼라이저
class ProbSerializer(WritableNestedModelSerializer):
    options = OptionSerializer(many=True, required=False)
    category = CategorySerializer()
    prob_seq = serializers.IntegerField(write_only=True)

    class Meta:
        model = Prob
        fields = ('prob_id', 'question', 'prob_seq', 'answer', 'options', 'category', 'difficulty', 'creator')

    def get_queryset(self):
        exam_id = self.kwargs.get('exam_pk')
        return Prob.objects.filter(exams__exam_id=exam_id).order_by('examprob__prob_seq')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # 출력 시 원하는 값을 추가
        exam_prob = ExamProb.objects.get(exam__exam_id=self.context.get('exam_pk'), prob=instance)
        representation['prob_seq'] = exam_prob.prob_seq
        return representation

    def create(self, validated_data):
        category_data = validated_data.pop('category')
        options_data = validated_data.pop('options', [])

        exam_id = self.context.get('exam_pk')
        try:
            exam = Exam.objects.get(exam_id=exam_id)
        except Exam.DoesNotExist:
            raise serializers.ValidationError({"detail": "존재하지 않는 시험지입니다."})

        # 카테고리 생성
        subject = category_data['subject']
        category_name = category_data['category_name']
        category = Category.objects.filter(subject=subject, category_name=category_name).first()
        
        if not category:
            category = Category.objects.create(subject=subject, category_name=category_name, creator=self.context['request'].user) # 존재하는 카테고라면 가져오고 아니라면 생성
        validated_data['category'] = category

        prob_seq = validated_data.pop('prob_seq')
        try:
            with transaction.atomic():
                # 문제 및 중간 모델 생성
                prob = Prob.objects.create(**validated_data, creator=self.context['request'].user.teacher)
                ExamProb.objects.create(exam=exam, prob=prob, prob_seq=prob_seq)

                # 옵션 생성
                for option_data in options_data:
                    Option.objects.create(prob=prob, **option_data)

            return prob
        except Exception as e:
            raise serializers.ValidationError({"detail": str(e)})

    def update(self, instance, validated_data):
        category_data = validated_data.pop('category', None)
        prob_seq = validated_data.pop('prob_seq', None)

        # 카테고리 수정
        if category_data:
            subject = category_data['subject']
            category_name = category_data['category_name']
            category = Category.objects.filter(subject=subject, category_name=category_name).first()
            if not category:
                category, _ = Category.objects.create(subject=subject, category_name=category_name, creator=self.context['request'].user) # 존재하는 카테고라면 가져오고 아니라면 생성
            instance.category = category  # 객체 자체를 수정

        # 문제 번호 수정
        if prob_seq:
            exam_id = self.context.get('exam_pk')
            try:
                exam = Exam.objects.get(exam_id=exam_id)
            except Exam.DoesNotExist:
                raise serializers.ValidationError({"detail": "존재하지 않는 시험지입니다."})

            try:
                exam_prob = ExamProb.objects.get(exam=exam, prob=instance)
            except Exam.DoesNotExist:
                raise serializers.ValidationError({"detail": "존재하지 않는 문제입니다."})

            try:
                exam_prob.prob_seq = prob_seq
                exam_prob.save()
            except Exception as e:
                raise serializers.ValidationError({"detail": str(e)})

        return super().update(instance, validated_data)

# 시험지 시리얼라이저
class ExamSerializer(serializers.ModelSerializer):
    # problems = ProbSerializer(many=True, required=False)

    class Meta:
        model = Exam
        fields = ('exam_id', 'exam_name', 'creator')


# 댓글(질의응답) 시리얼라이저
class CommentSerializer(serializers.ModelSerializer):
    # list 요청시 내보내는 필드 (모델에 관여하지 않음)
    author_id = serializers.UUIDField(source='author.uid', read_only=True)
    author_name = serializers.SerializerMethodField()
    author_type = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('comment_id', 'author_id', 'author_type', 'author_name', 'created_at', 'content')

    def create(self, validated_data):
        # 요청한 사용자로 author 설정
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

    def get_author_name(self, obj):
        teacher = Teacher.objects.filter(uid=obj.author.uid).first()
        if teacher:
            return teacher.name
        
        student = Student.objects.filter(uid=obj.author.uid).first()
        if student:
            return student.name
        
        return "Unknown"

    def get_author_type(self, obj):
        if Teacher.objects.filter(uid=obj.author.uid).exists():
            return "선생님"
        
        if Student.objects.filter(uid=obj.author.uid).exists():
            return "학생"
        
        return "Unknown"

# 푼 문제 시리얼라이저
class SolvedProbSerializer(serializers.ModelSerializer):
    correctness = serializers.BooleanField(required=False)
    class Meta:
        model = SolvedProb
        fields = ('solved_prob_id', 'prob', 'solution', 'response', 'correctness')


# 푼 시험지 시리얼라이저
class SolvedExamSerializer(serializers.ModelSerializer):
    problems = SolvedProbSerializer(many=True)
    comments = CommentSerializer(many=True, read_only=True)
    score = serializers.IntegerField(required=False) # 직접 계산할 필드
    exam_obj = ExamSerializer(source='exam', read_only=True)
    exam = serializers.PrimaryKeyRelatedField(queryset=Exam.objects.all(), write_only=True)

    class Meta:
        model  = SolvedExam
        fields = ('solved_exam_id', 'exam', 'exam_obj', 'student', 'teacher', 'feedback', 'time', 'score','solved_at', 'problems', 'comments', 'comments',)
        read_only_fields = ['student']  # student는 서버에서 추가

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # SolvedExam 리스트의 간단한 조회를 위해 problems, comments 필드를 제거
        if self.context.get('view').action == 'list':
            self.fields.pop('problems', None)
            self.fields.pop('comments', None)

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user.student
        # solved_problems는 일단 제외하고 solved_exam 생성
        problems_data = validated_data.pop('problems')
        solved_exam = SolvedExam.objects.create(**validated_data)
        # solved_problem 생성
        for problem_data in problems_data:
            # correctness 필드 값 계산
            prob_id = problem_data['prob'].prob_id
            response = problem_data['response']
            prob = Prob.objects.get(prob_id=prob_id)
            if (prob.answer == response):
                problem_data['correctness'] = True
            else:
                problem_data['correctness'] = False
            SolvedProb.objects.create(solved_exam=solved_exam, **problem_data)
        # score 필드 값 계산
        solved_exam.score = self.calculate_score(problems_data)
        solved_exam.save()
        return solved_exam
    
    # score 필드 값 계산을 위한 함수
    def calculate_score(self, problems_data):
        score = 0
        for problem in problems_data:
            if (problem['correctness'] == True):
                score += 1
        return score
    
    def update(self, instance, validated_data):
        instance.teacher = validated_data.get('teacher', instance.teacher)
        instance.feedback = validated_data.get('feedback', instance.feedback)
        instance.save()
        return instance
