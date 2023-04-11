from django.db import models

# Create your models here.


# List view
class FoodWaste(models.Model):
    TYPE_CHOICES = [
        ('household', 'Household waste'),
        ('retail', 'Retail waste'),
        ('restaurant', 'Restaurant waste'),
        ('agricultural', 'Agricultural waste'),
        ('processing', 'Processing waste'),
        ('transportation', 'Transportation and distribution waste'),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField()

class FoodDetail(models.Model):
    name = models.CharField(max_length=200, null=True, help_text="Waste Name")
    desc = models.TextField()