from django.test import TestCase
from django.conf import settings

# Create your tests here.


# test get user token for websockets
class SettingsTestCase(TestCase):
    
    def test_generate_websockets_token(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user = User.objects.create_user('jklew', 'jklewis99@gmail.com', 'richardnixon')
        user = User.objects.get(username="jklew")
        from sesame.utils import get_token
        token = get_token(user)
        self.assertIs(token, "this");
