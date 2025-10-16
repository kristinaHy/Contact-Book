from urllib import request
from rest_framework import viewsets,filters
from rest_framework.decorators import action
from .models import Contact
from . serializers import ContactAddressSerializer, ContactNameAddressSerializer, ContactNameSerializer, ContactSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class =ContactSerializer
    filter_backends = [filters.SearchFilter,filters.OrderingFilter]
    search_fields = ['name','address']
    ordering_fields = ['name','address']
    
    #custom action to get name (url stays /name)
    @action(detail=True,methods=['get'],url_path='name')
    def get_name_action(self,request,pk=None):
        contact = self.get_object()
        serializer = ContactNameSerializer(contact)
        return Response(serializer.data)

    
    @action(detail=True,methods=['get'],url_path='address')
    def get_address_action(self,request,pk=None):
        contact = self.get_object()
        serializer = ContactAddressSerializer(contact)
        return Response(serializer.data)
        
    @action(detail=True,methods=['get'],url_path='name_address')
    def get_name_address_action(self, request, pk=None):
        contact = self.get_object()
        serializer =ContactNameAddressSerializer(contact)
        return Response(serializer.data)