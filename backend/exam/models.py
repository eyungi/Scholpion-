from django.db import models
from account.models import Teacher
import uuid

class Subject(models.Model):
    subject = models.CharField(max_length=2, primary_key=True)

class Category(models.Model):
    category_id = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True, editable=False)

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    category_name = models.CharField(max_length=10)

    creator = models.ForeignKey(Teacher, null=True, on_delete=models.DO_NOTHING)

    # 유니크 조건을 걸지 않아도 잘 동작하긴 하는데 유니크 조건이 있으면 post, update시 실패하는 문제가 생김,,
    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(fields=['category_name', 'subject'], name='unique_category')
    #     ]

class Exam(models.Model):
    exam_id = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True, editable=False)
    creator = models.ForeignKey(Teacher, null=True, on_delete=models.DO_NOTHING)

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
