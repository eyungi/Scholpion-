# Generated by Django 5.1.1 on 2024-12-12 11:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('exam', '0020_alter_log_solved_exam'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='option',
            options={'ordering': ['prob_id', 'option_seq']},
        ),
    ]
