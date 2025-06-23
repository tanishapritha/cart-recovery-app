from flask import Blueprint, request, jsonify
from app.models import Item
from app.extensions import db

bp = Blueprint('item', __name__, url_prefix='/item')


@bp.route('/add', methods=['POST'])
def add_item():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')

    if not name or price is None:
        return jsonify({'error': 'Name and price required'}), 400

    try:
        item = Item(name=name, price=price)
        db.session.add(item)
        db.session.commit()
        return jsonify({'message': 'Item added', 'id': item.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add item', 'details': str(e)}), 500

@bp.route('/all', methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([{'id': item.id, 'name': item.name, 'price': item.price} for item in items])
