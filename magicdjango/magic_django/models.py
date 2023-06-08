from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.files import File
from django.db import models
from bson import ObjectId
from django.core.files import File
from PIL import Image
from djongo import models

class ObjectIdField(models.Field):
    description = "MongoDB ObjectID"

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return str(value)

    def to_python(self, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value

    def get_prep_value(self, value):
        if value is None or isinstance(value, ObjectId):
            return value
        return ObjectId(str(value))

class AuthUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, admin=False):
        user = self.model(
            username=username,
            email=self.normalize_email(email),
            admin=admin
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)


class AuthUser(AbstractBaseUser):
    _id = ObjectIdField(primary_key=True, unique=True, default=ObjectId, editable=False)
    id = models.IntegerField(unique=True)
    username = models.CharField(max_length=25, unique=True)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=30)
    confirm_password = models.CharField(max_length=30)
    admin = models.BooleanField(default=False)
    image = models.ImageField(null=True, blank=True)
    membership_level = models.IntegerField(
        default=1,
        choices=[(1, 'Silver'), (2, 'Gold'), (3, 'Platinum')],
        verbose_name='Membership Level',
        help_text='Select the membership level for the user.',
        null=True,
        blank=True
    )

    USERNAME_FIELD = 'username'
    objects = AuthUserManager()

    class Meta:
        db_table = 'magic_auth_user'

    def save(self, *args, **kwargs):
        if not self.id:
            # Generate the auto-incrementing value for id
            last_user = AuthUser.objects.order_by('-id').first()
            self.id = last_user.id + 1 if last_user else 1

        super().save(*args, **kwargs)

        if self.image:
            # Assuming you have a FileField for the `image` field
            # Open the image file and save it
            with self.image.open('rb') as file:
                self.image.save(f'{self.username}_profile_picture.jpg', File(file), save=True)


class CardManager(models.Manager):
    def create_card(self, card_id, name, expansion_set, mana_cost, power, toughness, card_type, ability, flavor_text, quote, requested, image=None):
        card = self.model(
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
            image=image,
        )
        card.save()
        return card


class Card(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    card_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    name = models.CharField(max_length=255, unique=True)
    expansion_set = models.CharField(max_length=255, null=True, blank=True)
    mana_cost = models.CharField(max_length=255, null=True, blank=True)
    power = models.CharField(max_length=255, null=True, blank=True)
    toughness = models.CharField(max_length=255, null=True, blank=True)
    card_type = models.IntegerField(
        choices=[(1, 'Sorcery'), (2, 'Instant'), (3, 'Land'), (4, 'Creature'), (5, 'Artifact'), (6, 'Enchantment'), (7, 'Planewalker'), (8, 'Battle')],
        null=True, blank=True
    )
    ability = models.CharField(max_length=255, null=True, blank=True)
    flavor_text = models.CharField(max_length=255, null=True, blank=True)
    quote = models.CharField(max_length=255, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    requested = models.BooleanField(default=False)

    objects = CardManager()

    class Meta:
        db_table = 'magic_cards'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.image:
            image = Image.open(self.image.path)
            image.save(f'media/{self.name}_card.jpg')  # Adjust the path to where you want to save the image

        
