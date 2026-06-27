from django.contrib import admin

from blog.models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = (
        'title_en',
        'category',
        'is_published',
        'published_at',
    )

    list_filter = (
        'category',
        'is_published',
    )

    search_fields = (
        'title_en',
        'title_sw',
    )

    prepopulated_fields = {
        'slug': ('title_en',)
    }