from flask import Blueprint, request, jsonify
from datetime import datetime
from app.models import Cart, CartItem
from app.extensions import db

bp = Blueprint('cart', __name__, url_prefix='/cart')

# Add to cart
@bp.route('/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    cart = Cart.query.filter_by(user_id=data['user_id'], status='active').first()
    
    if not cart:
        cart = Cart(user_id=data['user_id'])
        db.session.add(cart)
        db.session.commit()

    item = CartItem(cart_id=cart.id, item_id=data['item_id'], quantity=data['quantity'])
    cart.last_updated = datetime.utcnow()
    db.session.add(item)
    db.session.commit()
    
    return jsonify({'message': 'Item added to cart'}), 200

# Remove item
@bp.route('/remove', methods=['POST'])
def remove_item():
    data = request.get_json()
    item = CartItem.query.filter_by(cart_id=data['cart_id'], item_id=data['item_id']).first()
    if not item:
        return jsonify({'message': 'Item not found'}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item removed'}), 200

# Checkout
@bp.route('/checkout', methods=['POST'])
def checkout():
    data = request.get_json()
    cart = Cart.query.filter_by(id=data['cart_id']).first()
    if not cart:
        return jsonify({'message': 'Cart not found'}), 404

    cart.status = 'checked_out'
    db.session.commit()
    return jsonify({'message': 'Cart checked out'}), 200

# View cart (returns cart_id + items)
@bp.route('/view', methods=['GET'])
def view_cart():
    user_id = request.args.get('user_id')
    cart = Cart.query.filter_by(user_id=user_id, status='active').first()
    if not cart:
        return jsonify({'message': 'No active cart'}), 404

    items = []
    for i in cart.cart_items:
        item = i.item
        items.append({
            'item_id': item.id,
            'item_name': item.name,
            'price': item.price,
            'quantity': i.quantity
        })

    return jsonify({
        'cart_id': cart.id,
        'items': items
    })

# Abandonment report
@bp.route('/report', methods=['GET'])
def abandoned_report():
    carts = Cart.query.filter_by(status='abandoned').all()
    return jsonify([
        {
            'cart_id': c.id,
            'user_id': c.user_id,
            'last_updated': c.last_updated.isoformat()
        } for c in carts
    ])
