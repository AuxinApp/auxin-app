from flask_login import LoginManager, UserMixin
import hashlib
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# cyber security god please forgive me...
# PASSWORDS = {
#     "ash": "66483810b72db7712a5bbd7642bb20f2f29bb67e645b7fe471d0be0296be25efd2cc4041bd98ef477365c0e0768847277db58ac5e0a00383ee791fbfd1052618"
# }
# IDS = {
#     "ash": '1'
# }


cred = credentials.Certificate("auxin-15cd9-firebase-adminsdk-7fm1u-75aa4548a2.json")
app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://auxin-15cd9-default-rtdb.firebaseio.com/'
})


class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id 

    def get(user_id):
        if user_id in db.reference(f'/ids/').get().values():
            return User(user_id)
        else:
            return None

    def login_user(username, password):
        ref = db.reference(f'/users/{username}')

        # Read the data at the posts reference (this is a blocking operation)
        if not ref.get():
            return None
                
        hashed_password = hashlib.sha512(password.encode('utf-8')).hexdigest()        
        if hashed_password != ref.get()['password']:
            return None

        return User.get(db.reference(f'/ids/{username}').get())
