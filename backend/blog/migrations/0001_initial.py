from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('title_en', models.CharField(max_length=255)),
                ('title_sw', models.CharField(blank=True, max_length=255, null=True)),
                ('slug', models.CharField(max_length=255, unique=True)),
                ('category', models.CharField(choices=[('Maize', 'Maize'), ('Tomato', 'Tomato'), ('Coffee', 'Coffee'), ('Beans', 'Beans'), ('General', 'General')], default='General', max_length=50)),
                ('excerpt_en', models.TextField(blank=True, null=True)),
                ('excerpt_sw', models.TextField(blank=True, null=True)),
                ('body_en', models.TextField()),
                ('body_sw', models.TextField(blank=True, null=True)),
                ('cover_image', models.ImageField(blank=True, null=True, upload_to='blog/')),
                ('is_published', models.BooleanField(default=False)),
                ('published_at', models.DateTimeField(blank=True, null=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.user')),
            ],
            options={
                'ordering': ['-published_at'],
            },
        ),
    ]
