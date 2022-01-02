# Generated by Django 3.2.9 on 2021-12-01 01:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify', '0003_spotifytoken_session_key'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spotifytoken',
            name='access_token',
            field=models.CharField(max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name='spotifytoken',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='spotifytoken',
            name='expires_in',
            field=models.DateTimeField(null=True),
        ),
        migrations.AlterField(
            model_name='spotifytoken',
            name='refresh_token',
            field=models.CharField(max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name='spotifytoken',
            name='token_type',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
