from rest_framework import serializers
from drf_writable_nested import WritableNestedModelSerializer
from .models import Category, Option, Prob, Exam, SolvedProb, SolvedExam, Comment

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

    class Meta:
        model = Prob
        fields = ('prob_id', 'prob_seq', 'question', 'answer', 'options', 'category')

    def create(self, validated_data):
        category_data = validated_data.pop('category')
        options_data = validated_data.pop('options', [])

        # 카테고리 생성
        subject = category_data['subject']
        category_name = category_data['category_name']
        category, _ = Category.objects.get_or_create(subject=subject, category_name=category_name, creator=self.context['request'].user.teacher) # 존재하는 카테고라면 가져오고 아니라면 생성
        validated_data['category'] = category

        # 문제 생성
        prob = Prob.objects.create(**validated_data)

        # 옵션 생성
        for option_data in options_data:
            Option.objects.create(prob=prob, **option_data)

        return prob

    def update(self, instance, validated_data):
        category_data = validated_data.pop('category', None)
        if category_data:
            subject = category_data['subject']
            category_name = category_data['category_name']
        category, _ = Category.objects.get_or_create(subject=subject, category_name=category_name, creator=self.context['request'].user.teacher) # 존재하는 카테고라면 가져오고 아니라면 생성
        instance.category = category  # 객체 자체를 수정

        return super().update(instance, validated_data)

# 시험지 시리얼라이저
class ExamSerializer(serializers.ModelSerializer):
    problems = ProbSerializer(many=True, required=False)

    class Meta:
        model = Exam
        fields = ('exam_id', 'exam_name', 'problems', 'creator')

# 댓글(질의응답) 시리얼라이저
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('comment_id', 'author', 'created_at', 'content')

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

    class Meta:
        model  = SolvedExam
        fields = '__all__'
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
            # correctness 필드 값 계산
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
    
    # score 필드 값 계산을 위한 함수
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
