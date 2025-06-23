from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import models
import openai
from django.conf import settings
from .models import Conversation, Message
from .serializers import ConversationSerializer, ConversationListSerializer, MessageSerializer
import traceback

class ChatbotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            pregunta = request.data.get("pregunta")
            conversation_id = request.data.get("conversation_id")
            
            print(f"📝 Pregunta recibida: {pregunta}")
            print(f"🔗 Conversation ID: {conversation_id}")
            
            if not pregunta:
                return Response({"error": "La pregunta es obligatoria"}, status=status.HTTP_400_BAD_REQUEST)

            # Obtener o crear conversación
            if conversation_id:
                try:
                    conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
                    print(f"✅ Conversación encontrada: {conversation.id}")
                except:
                    print("❌ Conversación no encontrada, creando nueva")
                    conversation = Conversation.objects.create(user=request.user)
            else:
                conversation = Conversation.objects.create(user=request.user)
                print(f"🆕 Nueva conversación creada: {conversation.id}")

            # System prompt mejorado para comida
            system_prompt = (
                "Eres ChefBot, el asistente culinario experto del bar universitario. "
                "Tu misión es ayudar a preparar menús y recetas típicos de Ecuador, enfocados en platos sencillos, económicos y abundantes, ideales para estudiantes universitarios. "
                "Siempre prioriza recetas populares ecuatorianas (como bolón de verde, encebollado, tigrillo, seco de pollo, arroz con menestra, ceviche, empanadas, etc.) y platos fáciles de preparar con ingredientes locales o accesibles en Ecuador. "
                "Si el usuario proporciona ingredientes, SÓLO debes sugerir recetas o ideas usando EXCLUSIVAMENTE esos ingredientes. "
                "Si el usuario menciona un ingrediente ambiguo (por ejemplo, 'verde'), pregunta si se refiere a plátano verde u otro producto. "
                "NO agregues ingredientes que el usuario no haya mencionado. "
                "Puedes ayudar con:\n"
                "- Crear recetas personalizadas\n"
                "- Sugerir menús semanales o diarios para el bar\n"
                "- Explicar técnicas básicas de cocina ecuatoriana\n"
                "- Recomendar sustitutos de ingredientes locales\n"
                "- Dar consejos para ahorrar tiempo o dinero en la cocina\n"
                "- Ayudar con la planificación de menús económicos para grupos grandes\n"
                "Si te preguntan sobre temas no relacionados con comida, responde amablemente que eres especialista solo en cocina y menús del bar universitario."
            )

            # Obtener historial de la conversación
            messages_history = []
            
            # Agregar system prompt
            messages_history.append({"role": "system", "content": system_prompt})
            
            # Agregar mensajes anteriores (últimos 10 para no exceder límites)
            try:
                previous_messages = conversation.messages.order_by('-created_at')[:10][::-1]
                for msg in previous_messages:
                    if msg.role != 'system':
                        messages_history.append({"role": msg.role, "content": msg.content})
                print(f"📚 Mensajes anteriores cargados: {len(previous_messages)}")
            except Exception as e:
                print(f"⚠️ Error al cargar mensajes anteriores: {e}")
            
            # Agregar pregunta actual
            messages_history.append({"role": "user", "content": pregunta})

            # Guardar mensaje del usuario
            try:
                user_message = Message.objects.create(
                    conversation=conversation,
                    role='user',
                    content=pregunta
                )
                print(f"💾 Mensaje de usuario guardado: {user_message.id}")
            except Exception as e:
                print(f"❌ Error al guardar mensaje de usuario: {e}")
                return Response({"error": "Error al guardar mensaje"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Verificar configuración de OpenAI
            if not settings.OPENAI_API_KEY:
                return Response({"error": "API Key de OpenAI no configurada"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Llamada a OpenAI
            try:
                print("🤖 Llamando a OpenAI...")
                client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
                respuesta = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=messages_history,
                    max_tokens=800,
                    temperature=0.7
                )
                
                texto_respuesta = respuesta.choices[0].message.content
                tokens_used = respuesta.usage.total_tokens if respuesta.usage else 0
                print(f"✅ Respuesta de OpenAI recibida. Tokens: {tokens_used}")

            except Exception as e:
                print(f"❌ Error en OpenAI: {e}")
                return Response({"error": f"Error al consultar OpenAI: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Guardar respuesta del asistente
            try:
                assistant_message = Message.objects.create(
                    conversation=conversation,
                    role='assistant',
                    content=texto_respuesta,
                    tokens_used=tokens_used
                )
                print(f"💾 Respuesta guardada: {assistant_message.id}")
            except Exception as e:
                print(f"❌ Error al guardar respuesta: {e}")
                return Response({"error": "Error al guardar respuesta"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Actualizar título de conversación si es nueva
            try:
                if not conversation.title:
                    conversation.save()
                    print("📝 Título de conversación actualizado")
            except Exception as e:
                print(f"⚠️ Error al actualizar título: {e}")

            return Response({
                "respuesta": texto_respuesta,
                "conversation_id": conversation.id,
                "tokens_used": tokens_used,
                "message_id": assistant_message.id
            })

        except Exception as e:
            print(f"💥 Error general en chatbot: {e}")
            print(f"🔍 Traceback: {traceback.format_exc()}")
            return Response({"error": f"Error interno del servidor: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConversationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            conversations = Conversation.objects.filter(user=request.user, is_active=True)
            serializer = ConversationListSerializer(conversations, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"❌ Error al obtener conversaciones: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            conversation = Conversation.objects.create(user=request.user)
            serializer = ConversationSerializer(conversation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"❌ Error al crear conversación: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConversationDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        try:
            conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
            serializer = ConversationSerializer(conversation)
            return Response(serializer.data)
        except Exception as e:
            print(f"❌ Error al obtener detalles de conversación: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, conversation_id):
        try:
            conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
            conversation.is_active = False
            conversation.save()
            return Response({"message": "Conversación eliminada"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print(f"❌ Error al eliminar conversación: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, conversation_id):
        try:
            conversation = get_object_or_404(Conversation, id=conversation_id, user=request.user)
            title = request.data.get('title')
            if title:
                conversation.title = title
                conversation.save()
                return Response({"message": "Título actualizado"})
            return Response({"error": "Título requerido"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"❌ Error al actualizar título: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConversationStatsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_conversations = Conversation.objects.filter(user=request.user, is_active=True)
            total_conversations = user_conversations.count()
            total_messages = Message.objects.filter(conversation__in=user_conversations).count()
            total_tokens = Message.objects.filter(conversation__in=user_conversations).aggregate(
                total=models.Sum('tokens_used')
            )['total'] or 0

            return Response({
                "total_conversations": total_conversations,
                "total_messages": total_messages,
                "total_tokens_used": total_tokens,
                "average_messages_per_conversation": round(total_messages / total_conversations, 2) if total_conversations > 0 else 0
            })
        except Exception as e:
            print(f"❌ Error al obtener estadísticas: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
