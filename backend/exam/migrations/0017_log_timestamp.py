# Generated by Django 5.1.1 on 2024-12-12 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exam', '0016_remove_log_timestamp'),
    ]

    operations = [
        migrations.AddField(
            model_name='log',
            name='timestamp',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
