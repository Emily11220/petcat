# Generated by Django 4.2 on 2023-04-10 12:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FoodDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('desc', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='FoodWaste',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('household', 'Household waste'), ('retail', 'Retail waste'), ('restaurant', 'Restaurant waste'), ('agricultural', 'Agricultural waste'), ('processing', 'Processing waste'), ('transportation', 'Transportation and distribution waste')], max_length=20)),
                ('description', models.TextField()),
            ],
        ),
    ]