# Generated by Django 5.1.1 on 2024-12-12 08:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exam', '0019_alter_log_solved_exam'),
    ]

    operations = [
        migrations.AlterField(
            model_name='log',
            name='solved_exam',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='exam.solvedexam'),
        ),
    ]
