from django_filters import rest_framework as filters

from django.utils import timezone
from datetime import timedelta

from .models import Project, Todo


class ProjectFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='contains')

    class Meta:
        model = Project
        fields = (
            'name',
        )


class TodoFilter(filters.FilterSet):
    project__name = filters.CharFilter(field_name='project', lookup_expr='iexact')
    text = filters.CharFilter(lookup_expr='contains')
    # created_at = filters.DateTimeFilter(lookup_expr='iexact')
    created_at = filters.DateFromToRangeFilter()
    updated_at = filters.DateTimeFilter(lookup_expr='iexact')
    user__name = filters.CharFilter(field_name='user', lookup_expr='iexact')
    status__TODO_STATUS_CHOICES = filters.CharFilter(field_name='status', lookup_expr='iexact')

    hours = filters.DateTimeFilter(
        field_name='created_at', method='get_past_n_hours', label="Past n hours"
    )

    class Meta:
        model = Todo
        fields = (
            'project',
            'text',
            'created_at',
            'updated_at',
            'user',
            'status',
        )
