from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from authentication.models import Profile

CustomUser = get_user_model()

# Custom admin display for users
class CustomUserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_superuser')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important dates', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'is_active', 'is_staff')}
        ),
    )

admin.site.register(CustomUser, CustomUserAdmin)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'gender', 'birth_date', 'birth_time', 'birth_place',
        'latitude', 'longitude', 'nakshatra', 'lagna'
    )
    search_fields = ('user__email', 'birth_place', 'nakshatra', 'lagna')
    list_filter = ('gender', 'nakshatra', 'lagna')
    readonly_fields = ('latitude', 'longitude', 'nakshatra', 'lagna', 'yogas')
    fieldsets = (
        (None, {
            'fields': ('user', 'gender', 'birth_date', 'birth_time', 'birth_place')
        }),
        ('Astrological Details', {
            'fields': ('latitude', 'longitude', 'nakshatra', 'lagna', 'yogas')
        })
    )
