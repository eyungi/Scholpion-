import random
from .models import Prob, SolvedProb, Category
from math import ceil
from django.db.models import Avg, F, IntegerField, ExpressionWrapper
from django.shortcuts import get_object_or_404

def calculate_user_level(user):
    # 유저가 푼 모든 문제 기록 조회
    solved_probs = SolvedProb.objects.filter(solved_exam__student=user)
     # 점수 계산: 난이도 * 정답률
    solved_probs = solved_probs.annotate(
        score=ExpressionWrapper(
            F("prob__difficulty") * F("correctness"),
            output_field=IntegerField()
        )
    )

    # 평균 점수 계산
    avg_score = solved_probs.aggregate(avg_score=Avg("score"))["avg_score"] or 0
    return ceil(avg_score)

def get_recommended_probs(student, category_name):
    level = calculate_user_level(student)
    if level == 0:
        level = 1
    category = get_object_or_404(Category, category_name=category_name)

    # 학생이 푼 문제 ID 가져오기
    solved_problem_ids = SolvedProb.objects.filter(
        solved_exam__student=student
    ).values_list('prob_id', flat=True)

    # 난이도별 문제 필터링
    low_difficulty_probs = list(Prob.objects.filter(
        category=category,
        difficulty=level-1 if level >= 2 else 1
    ).exclude(prob_id__in=solved_problem_ids))  # 안 푼 문제 필터링

    medium_difficulty_probs = list(Prob.objects.filter(
        category=category,
        difficulty=level
    ).exclude(prob_id__in=solved_problem_ids))  # 안 푼 문제 필터링

    high_difficulty_probs = list(Prob.objects.filter(
        category=category,
        difficulty=level+1 if level <= 4 else 5
    ).exclude(prob_id__in=solved_problem_ids))  # 안 푼 문제 필터링

    # 랜덤으로 문제 선택
    return (
        random.sample(low_difficulty_probs, min(2, len(low_difficulty_probs))) +
        random.sample(medium_difficulty_probs, min(2, len(medium_difficulty_probs))) +
        random.sample(high_difficulty_probs, min(1, len(high_difficulty_probs)))
    )