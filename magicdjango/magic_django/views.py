from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from .models import AuthUser, Card
from django.core import serializers
from django.core.files.base import ContentFile
import base64
import io
from PIL import Image
from django.core.files import File

@csrf_exempt
@require_http_methods(['POST'])
def MyView(request):
    data = json.loads(request.body)
    return JsonResponse({'message': 'Hello ' + data['firstname']})

@csrf_exempt
@require_http_methods(['POST', 'GET'])
def Register(request):
    data = json.loads(request.body)

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    admin = False
    if len(username) < 6 or len(username) > 25:
        return JsonResponse({'authentication': False, 'error_code': 1}, status=400)

    if len(email) > 100:
        return JsonResponse({'authentication': False, 'error_code': 2}, status=400)

    if len(password) < 8 or len(password) > 30:
        return JsonResponse({'authentication': False, 'error_code': 3}, status=400)

    if password != confirm_password:
        return JsonResponse({'authentication': False, 'error_code': 4}, status=400)

    try:
        AuthUser.objects.get(username=username)
        return JsonResponse({'authentication': False, 'error_code': 5}, status=400)
    except AuthUser.DoesNotExist:
        pass

    new_user = AuthUser.objects.create_user(username=username, email=email, password=password, admin=admin)
    new_user.save()

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        session_data = {
            'authentication': True,
            'user_id': str(user.id),
            'username': user.username,
            'message': 'no problem'
        }
        response_data = session_data
    else:
        response_data = {'authentication': False, 'message': "Invalid username or password."}

    return JsonResponse(response_data, status=200)

@csrf_exempt
@require_http_methods(['POST', 'GET'])
def CheckUserAuthentication(request):
    if request.user.is_authenticated:
        user = request.user
        image_url = user.image.url if user.image else None
        return JsonResponse({
            'authentication': True,
            'user_id': str(user.id),
            'username': user.username,
            'image': image_url,
            'isAdmin' : user.admin
        }, status=200)
    else:
        return JsonResponse({'authentication': False})

@csrf_exempt
@require_http_methods(['POST'])
def login_user(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        image_url = user.image.url if user.image else None
        session_data = {
            'authentication': True,
            'user_id': str(user.id),
            'username': user.username,
            'image': image_url,
            'isAdmin': user.admin
        }
        return JsonResponse(session_data, status=200)
    else:
        return JsonResponse({'authentication': False}, status=401)

@csrf_exempt
@require_http_methods(['POST'])
def logout_user(request):
    if request.user.is_authenticated:
        logout(request)
        message = 'Logged out successfully'
    else:
        message = 'No one was authenticated'
    return JsonResponse({'authentication': False, 'message': message}, status=200)

def search_user_by_username(username):
    try:
        user = AuthUser.objects.get(username=username)
        return user
    except AuthUser.DoesNotExist:
        return None

@csrf_exempt
@require_http_methods(['POST'])
def user_profile_verify(request):
    data = json.loads(request.body)

    username = data.get('username')
    user = search_user_by_username(username)
    if user:
        serialized_user = serializers.serialize('json', [user])
        return JsonResponse({'exist_user': True, 'user': serialized_user})
    else:
        return JsonResponse({'exist_user': False, 'user': None})

@csrf_exempt
def save_profile_picture(request):
    username = request.POST.get('username')
    imageData = request.FILES.get('image')

    try:
        user = AuthUser.objects.get(username=username)

        # Save the image to the user's profile
        user.image.save(f'{username}_profile_picture.jpg', imageData, save=True)

        return JsonResponse({'message': 'Profile picture saved successfully!'})
    except AuthUser.DoesNotExist:
        return JsonResponse({'message': 'User not found.'}, status=401)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    
@csrf_exempt
@require_http_methods(['POST', 'GET'])
def get_profile_picture(request):
    data = json.loads(request.body)

    try:
        user = AuthUser.objects.get(username=data.username)
        image_url = str(user.image.url) if user.image else None

        return JsonResponse({'image': image_url})
    except AuthUser.DoesNotExist:
        return JsonResponse({'message': 'User not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    
from django.core.files.storage import default_storage

@csrf_exempt
def card_add(request):
    print(request.POST)
    card_id = request.POST.get('card_id')
    name = request.POST.get('name')
    expansion_set = request.POST.get('expansion_set')
    mana_cost = request.POST.get('mana_cost')
    power = request.POST.get('power')
    toughness = request.POST.get('toughness')
    card_type = request.POST.get('card_type')
    ability = request.POST.get('ability')
    flavor_text = request.POST.get('flavor_text')
    quote = request.POST.get('quote')
    requested = request.POST.get('requested')

    imageData = request.FILES.get('imageData')
    print(imageData)
    print('Image Data:', imageData)
    image_name = None

    if imageData:
        # Generate a unique file name for the uploaded image
        image_name = f'{imageData.name}_card.jpg'

        # Save the file using Django's default storage
        default_storage.save(image_name, imageData)

    card = Card.objects.create_card(
        card_id=card_id,
        name=name,
        expansion_set=expansion_set,
        mana_cost=mana_cost,
        power=power,
        toughness=toughness,
        card_type=card_type,
        ability=ability,
        flavor_text=flavor_text,
        quote=quote,
        requested=requested,
        image=image_name,
    )

    return JsonResponse({'message': 'Card saved successfully!'})

    
@csrf_exempt
@require_http_methods(['GET'])
def get_card(request):
    card_name = request.GET.get('name')

    try:
        card = Card.objects.get(name=card_name)

        card_data = {
            # '_id' : card._id,
            'card_id': card.card_id,
            'name': card.name,
            'expansion_set': card.expansion_set,
            'mana_cost': card.mana_cost,
            'power': card.power,
            'toughness': card.toughness,
            'card_type': card.card_type,
            'ability': card.ability,
            'flavor_text': card.flavor_text,
            'quote': card.quote,
            'image_url': card.image.url if card.image else None,
            'requested' : card.requested
        }

        return JsonResponse(card_data)
    except Card.DoesNotExist:
        return JsonResponse({'message': 'Card not found.'}, status=404)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)

@csrf_exempt
@require_http_methods(['GET', 'POST'])
def cards_list(request):
    cards = Card.objects.all()
    data = [
        {
            'id': card.card_id,
            'name': card.name,
            'expansion_set': card.expansion_set,
            'mana_cost': card.mana_cost,
            'power': card.power,
            'toughness': card.toughness,
            'card_type': card.card_type,
            'ability': card.ability,
            'flavor_text': card.flavor_text,
            'quote': card.quote,
            # 'image_data': card.image,
            'requested' : card.requested
        }
        for card in cards
    ]
    return JsonResponse(data, safe=False)
    