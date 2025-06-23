from django.urls import path
from .views import (
    ChatbotAPIView,
    ConversationListAPIView,
    ConversationDetailAPIView,
    ConversationStatsAPIView,
)

urlpatterns = [
    path('chatbot/', ChatbotAPIView.as_view(), name='chatbot_api'),
    path('chatbot/conversations/', ConversationListAPIView.as_view(), name='chatbot_conversation_list'),
    path('chatbot/conversations/<int:conversation_id>/', ConversationDetailAPIView.as_view(), name='chatbot_conversation_detail'),
    path('chatbot/stats/', ConversationStatsAPIView.as_view(), name='chatbot_stats'),
]
