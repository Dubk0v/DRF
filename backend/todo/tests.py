from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate, APIClient, APISimpleTestCase, APITestCase
from mixer.backend.django import mixer
from .views import ToDoModelViewSet
from .models import ToDo, User


class TestToDoViewSet(TestCase):

    def test_edit_mixer(self):
        todo = mixer.blend(ToDo, text='test')
        admin = User.objects.create_superuser('admin', 'admin@admin.com',
                                              'admin123456')
        self.client.login(username='admin', password='admin123456')
        todo = ToDo.objects.get(id=todo.id)
        self.assertEqual(todo.text, 'test')