from django.db import models
from account.models import Student, Teacher, User
import uuid

class Subject(models.Model):
    subject = models.CharField(max_length=2, primary_key=True)

class Category(models.Model):
    category_id = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True, editable=False)

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    category_name = models.CharField(max_length=10)

    creator = models.ForeignKey(Teacher, null=True, on_delete=models.SET_NULL)

    # 유니크 조건을 걸지 않아도 잘 동작하긴 하는데 유니크 조건이 있으면 post, update시 실패하는 문제가 생김,,
    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(fields=['category_name', 'subject'], name='unique_category')
    #     ]

class Exam(models.Model):
    exam_id = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True, editable=False)
    creator = models.ForeignKey(Teacher, null=True, on_delete=models.SET_NULL)

    exam_name = models.CharField(max_length=255)
    explanation = models.CharField(max_length=512, null=True)

class Prob(models.Model):
    prob_id = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True, editable=False)

    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    prob_seq = models.IntegerField()

    question = models.TextField()
    answer = models.CharField(max_length=512)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['exam', 'prob_seq'], name='unique_prob')
        ]

class Option(models.Model):
    option_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, primary_key=True)

    prob = models.ForeignKey(Prob, on_delete=models.CASCADE, related_name='options')
    option_seq = models.IntegerField()

    option_text = models.TextField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['prob_id', 'option_seq'], name='unique_option')
        ]

class SolvedExam(models.Model):
    solved_exam_id = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True, editable=False)

    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)

    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    time = models.DurationField()
    score = models.IntegerField(null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['exam', 'student'], name='unique_solved_exam')
        ]

class SolvedProb(models.Model):
    solved_prob_id = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True, editable=False)

    solved_exam = models.ForeignKey(SolvedExam, on_delete=models.CASCADE, related_name='problems')
    prob = models.ForeignKey(Prob, on_delete=models.CASCADE)

    solution = models.ImageField(upload_to='solution')
    response = models.CharField(max_length=512, null=True, blank=True)
    correctness = models.BooleanField(null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['solved_exam', 'solved_prob_id'], name='unique_solved_prob')
        ]

class Comment(models.Model):
    comment_id = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True, editable=False)

    solved_exam = models.ForeignKey(SolvedExam, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
