from django.db import models

from common.models import BaseModel


class Crop(BaseModel):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
