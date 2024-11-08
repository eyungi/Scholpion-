from django.contrib import admin
from .models import User, Teacher, Student

class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'uid']

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Teacher, UserAdmin)
admin.site.register(Student, UserAdmin)