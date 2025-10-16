from dataclasses import field
from rest_framework import serializers
from .models import  Contact

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id','name','phone','address']
        
#custom serializers for partial responses
class ContactNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id','name']
        
class ContactAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id','address']
        
class ContactNameAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id','name','address']