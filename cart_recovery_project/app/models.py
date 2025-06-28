from app.extensions import db
from datetime import datetime
from sqlalchemy.schema import UniqueConstraint

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120), nullable=False)
    __table_args__ = (UniqueConstraint('email', name='uq_user_email'),)

    __table_args__ = (
        UniqueConstraint('email', name='uq_user_email'),
    )




class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='active')
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

 
    user = db.relationship('User', backref='carts', lazy=True)

    # One cart has many cart items
    cart_items = db.relationship('CartItem', backref='cart', lazy=True)


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Float)

    # Define one side with backref
    cart_items = db.relationship('CartItem', backref='item', lazy=True)


class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    quantity = db.Column(db.Integer)

    # ❌ REMOVE this line:
    # item = db.relationship('Item', backref='cart_items')



class AbandonmentLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    abandoned_at = db.Column(db.DateTime, default=datetime.utcnow)
    notified = db.Column(db.Boolean, default=False)


class EmailLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120))
    subject = db.Column(db.String(255))
    body = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
