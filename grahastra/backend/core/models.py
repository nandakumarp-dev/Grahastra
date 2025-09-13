from django.db import models

# Create your models here.

class UserQuestion(models.Model):
    name = models.CharField(max_length=100)
    birth_date = models.DateField()
    birth_time = models.TimeField()
    birth_place = models.CharField(max_length=100)
    question = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.question[:30]}"


# class UserQuestion(models.Model):
#     name = models.CharField(max_length=100)
#     birth_date = models.DateField()
#     birth_time = models.TimeField()
#     birth_place = models.CharField(max_length=100)
#     question = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.name} - {self.question[:30]}"