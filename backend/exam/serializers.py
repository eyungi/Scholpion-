from rest_framework import serializers
from drf_writable_nested import WritableNestedModelSerializer
from .models import Category, Option, Prob, Exam

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
    explanation = serializers.CharField(required=False, allow_null=True)
    problems = ProbSerializer(many=True, required=False)

    class Meta:
        model = Exam
        fields = ('exam_id', 'exam_name', 'explanation', 'problems', 'creator')
