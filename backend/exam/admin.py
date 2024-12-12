from django.contrib import admin
from .models import Subject, Category, Exam, Prob, ExamProb, Option, SolvedProb, SolvedExam, Comment, Log


class SubjectAdmin(admin.ModelAdmin):
    list_display = ('subject',)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_id', 'category_name', 'subject')

class ExamAdmin(admin.ModelAdmin):
    list_display = ('exam_id', 'exam_name')

class ProbAdmin(admin.ModelAdmin):
    list_display = ('prob_id', 'exam_name')

    def exam_name(self, obj):
        return ", ".join([exam.exam_name for exam in obj.exams.all()])

class ExamProbAdmin(admin.ModelAdmin):
    list_display = ('exam_name', 'prob_seq')

    def exam_name(self, obj):
        return obj.exam.exam_name

class OptionAdmin(admin.ModelAdmin):
    list_display = ('option_id', 'prob', 'option_seq', 'option_text')


class SolvedProbAdmin(admin.ModelAdmin):
    list_display = ('solved_prob_id', 'exam_name', 'response', 'correctness')

    def exam_name(self, obj):
        return obj.solved_exam.exam.exam_name

class SolvedExamAdmin(admin.ModelAdmin):
    list_display = ('solved_exam_id', 'exam_name', 'student', 'teacher', 'feedback', 'time', 'score')

    def exam_name(self, obj):
        return obj.exam.exam_name
class CommentAdmin(admin.ModelAdmin):
    list_display = ('comment_id', 'solved_exam', 'author', 'content')

# Register your models here.
admin.site.register(Subject, SubjectAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Exam, ExamAdmin)
admin.site.register(Option, OptionAdmin)
admin.site.register(Prob, ProbAdmin)
admin.site.register(ExamProb, ExamProbAdmin)
admin.site.register(SolvedProb, SolvedProbAdmin)
admin.site.register(SolvedExam, SolvedExamAdmin)
admin.site.register(Comment, CommentAdmin)
@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ('solved_exam', 'prob_seq', 'action', 'timestamp')
