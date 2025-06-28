from flask import Blueprint, request, jsonify, render_template
from datetime import datetime
from app.models import Cart, CartItem
from app.extensions import db

bp = Blueprint('cart', __name__, url_prefix='/cart')

# Add to cart
from app.models import User
from sqlalchemy.exc import IntegrityError

@bp.route('/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()

    # Ensure user exists with email
    user = User.query.filter_by(id=data['user_id']).first()
    if not user:
        if 'email' not in data:
            return jsonify({'message': 'Email required to create user'}), 400
        user = User(id=data['user_id'], email=data['email'])
        db.session.add(user)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify({'message': 'User creation failed'}), 500

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



@bp.route('/cart/report')
def abandoned_report():
    abandoned = Cart.query.filter_by(status='abandoned').all()
    data = [{
        "cart_id": cart.id,
        "user_id": cart.user_id,
        "email": cart.user.email if cart.user else None,
        "last_updated": cart.last_updated.isoformat()
    } for cart in abandoned]
    return jsonify(data)



@bp.route('/abandoned')
def abandoned_page():
    return render_template('abandoned.html')