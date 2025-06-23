from flask import Blueprint, request, jsonify
from app.models import User
from app.extensions import db

bp = Blueprint('user', __name__, url_prefix='/user')

@bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')

    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400

    try:
        user = User(name=name, email=email)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created', 'id': user.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@bp.route('/all', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'name': u.name, 'email': u.email} for u in users])
