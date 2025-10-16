from django.db import models

class Contact (models.Model):
    name = models.CharField(max_length=255,null=True)
    phone = models.CharField(max_length=50,null=True,blank=True)
    address = models.TextField(null=True,blank=True)
    
    def __str__(self):
        return self.name or "contact"
