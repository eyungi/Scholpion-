# Generated by Django 5.1.1 on 2024-12-12 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exam', '0013_solvedprob_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solvedprob',
            name='time',
            field=models.IntegerField(default=0),
        ),
    ]
