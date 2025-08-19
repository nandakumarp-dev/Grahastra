from rest_framework import serializers
from authentication.models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["birth_date", "birth_time", "birth_place", "latitude", "longitude"]

class PlanetSerializer(serializers.Serializer):
    name = serializers.CharField()
    degree = serializers.CharField()
    rasi = serializers.CharField()
    rasi_lord = serializers.CharField()
    nakshatra = serializers.CharField()
    nakshatra_lord = serializers.CharField()

class NavamsaSerializer(serializers.Serializer):
    name = serializers.CharField()
    navamsa_rasi = serializers.CharField()
    rasi_lord = serializers.CharField()

class BhavaChartSerializer(serializers.Serializer):
    house = serializers.CharField()
    planets = serializers.ListField(child=serializers.CharField())
