from django.contrib import admin
from .models import Subject, Category, Exam, Prob, Option

class SubjectAdmin(admin.ModelAdmin):
    list_display = ('subject',)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_id', 'category_name', 'subject')

class ExamAdmin(admin.ModelAdmin):
    list_display = ('exam_id', 'exam_name')

class ProbAdmin(admin.ModelAdmin):
    list_display = ('prob_id', 'exam_id', 'prob_seq')

class OptionAdmin(admin.ModelAdmin):
    list_display = ('option_id', 'prob_id', 'option_seq', 'option_text')


# Register your models here.
admin.site.register(Subject, SubjectAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Exam, ExamAdmin)
admin.site.register(Prob, ProbAdmin)
admin.site.register(Option, OptionAdmin)
