import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, jsonify, abort

# Initialize Firebase once
cred = credentials.Certificate('./event-aggregator-service-Account-Key.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

class UserData:
    """
    Provides methods to interact with user subcollections in Firestore.
    """

    @staticmethod
    def get_subcollection(user_id: str, subcollection: str):
        """
        Generic fetch for a user's subcollection.

        :param user_id: Firestore document ID of the user.
        :param subcollection: Name of the subcollection to fetch.
        :return: List of dicts representing documents in the subcollection.
        """
        try:
            docs = db.collection('users').document(user_id).collection(subcollection).stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            # Log error or return None to indicate failure
            print(f"Error fetching {subcollection} for {user_id}: {e}")
            return None

    @classmethod
    def get_posts(cls, user_id: str):
        return cls.get_subcollection(user_id, 'posts')

    @classmethod
    def get_replies(cls, user_id: str):
        return cls.get_subcollection(user_id, 'replies')

    @classmethod
    def get_upvotes(cls, user_id: str):
        return cls.get_subcollection(user_id, 'upvotes')

    @classmethod
    def get_downvotes(cls, user_id: str):
        return cls.get_subcollection(user_id, 'downvotes')

    @classmethod
    def get_reply_upvotes(cls, user_id: str):
        return cls.get_subcollection(user_id, 'reply_upvotes')

    @classmethod
    def get_reply_downvotes(cls, user_id: str):
        return cls.get_subcollection(user_id, 'reply-downvotes')

# Flask application
app = Flask(__name__)

# Mapping endpoints to UserData methods
ENDPOINTS = {
    'posts': UserData.get_posts,
    'replies': UserData.get_replies,
    'upvotes': UserData.get_upvotes,
    'downvotes': UserData.get_downvotes,
    'reply_upvotes': UserData.get_reply_upvotes,
    'reply-downvotes': UserData.get_reply_downvotes,
}

def create_route(route, func):
    def view(user_id):
        data = func(user_id)
        if data is not None:
            return jsonify(data), 200
        else:
            abort(404)
    return view

# Create routes dynamically with unique endpoint names
for route, func in ENDPOINTS.items():
    app.add_url_rule(
        f'/users/<user_id>/{route}', 
        view_func=create_route(route, func), 
        methods=['GET'], 
        endpoint=f"user_{route}"  # Assign unique endpoint names
    )

if __name__ == '__main__':
    # You can change host and port as needed
    app.run(debug=True, host='0.0.0.0', port=5005)
