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
    def get_filtered_probs(difficulty_level):
        excluded_ids = solved_problem_ids
        return Prob.objects.filter(
            category=category,
            difficulty=difficulty_level
        ).exclude(prob_id__in=excluded_ids)
    
    # 난이도별 문제 필터링 및 랜덤 선택
    low_difficulty_probs = get_filtered_probs(level-1 if level >= 2 else 1)    
    medium_difficulty_probs = get_filtered_probs(level)
    high_difficulty_probs = get_filtered_probs(level+1 if level <= 4 else 5)

    selected_probs_qs = Prob.objects.none()  # 중복 선택 방지를 위한 쿼리셋
    # 난이도별로 문제를 선택하고 중복 방지
    selected_probs = []
    selected_probs += random.sample(list(low_difficulty_probs), min(2, len(low_difficulty_probs)))
    selected_probs_qs = selected_probs_qs | Prob.objects.filter(prob_id__in=[prob.prob_id for prob in selected_probs])

    selected_probs += random.sample(list(medium_difficulty_probs), min(2, len(medium_difficulty_probs)))
    selected_probs_qs = selected_probs_qs | Prob.objects.filter(prob_id__in=[prob.prob_id for prob in selected_probs])

    selected_probs += random.sample(list(high_difficulty_probs), min(1, len(high_difficulty_probs)))
    selected_probs_qs = selected_probs_qs | Prob.objects.filter(prob_id__in=[prob.prob_id for prob in selected_probs])

    # 랜덤으로 문제 선택
    return selected_probs_qs