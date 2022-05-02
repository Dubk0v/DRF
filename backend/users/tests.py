from django.test import TestCase

# Create your tests here.
import json
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate, APIClient, APISimpleTestCase, APITestCase
from mixer.backend.django import mixer
from .views import UserModelViewSet
from .models import User


class TestUserViewSet(TestCase):

    def test_edit_admin(self):
        user = User.objects.create(username='aaa', email='aaa@aa.com')
        client = APIClient()
        User.objects.create_superuser('admin', 'admin@admin.com', 'admin123456')
        client.login(username='admin', password='admin123456')
        response = client.put(f'/api/users/{user.id}/', {'username': 'Грин', 'email': 'ss@ss.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = User.objects.get(id=user.id)
        self.assertEqual(user.username, 'Грин')
        self.assertEqual(user.email, 'ss@ss.com')
        client.logout()

    def test_get_list_403(self):
        factory = APIRequestFactory()
        request = factory.get('/api/users/')
        view = UserModelViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
