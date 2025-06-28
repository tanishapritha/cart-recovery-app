from datetime import datetime, timedelta, timezone
from app import create_app
from app.extensions import db
from app.models import User, Cart, CartItem, Item

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    # Create Users
    user1 = User(name="Alice", email="alice@example.com")
    user2 = User(name="Bob", email="bob@example.com")
    user3 = User(name="Charlie", email="charlie@example.com")
    db.session.add_all([user1, user2, user3])
    db.session.commit()

    # Create Items
    item1 = Item(name="Phone", price=50000)
    item2 = Item(name="Book", price=400)
    item3 = Item(name="Shoes", price=2000)
    db.session.add_all([item1, item2, item3])
    db.session.commit()

    # Create Carts (5 abandoned, 1 active)
    carts = [
        Cart(user_id=user1.id, status="abandoned", last_updated=datetime.now(timezone.utc) - timedelta(hours=1)),
        Cart(user_id=user2.id, status="abandoned", last_updated=datetime.now(timezone.utc) - timedelta(hours=2)),
        Cart(user_id=user3.id, status="abandoned", last_updated=datetime.now(timezone.utc) - timedelta(days=1)),
        Cart(user_id=user1.id, status="abandoned", last_updated=datetime.now(timezone.utc) - timedelta(minutes=40)),
        Cart(user_id=user2.id, status="abandoned", last_updated=datetime.now(timezone.utc) - timedelta(hours=4)),
        Cart(user_id=user3.id, status="active", last_updated=datetime.now(timezone.utc)),
    ]
    db.session.add_all(carts)
    db.session.commit()

    # Add items to some carts
    cart_items = [
        CartItem(cart_id=carts[0].id, item_id=item1.id, quantity=1),
        CartItem(cart_id=carts[2].id, item_id=item2.id, quantity=2),
        CartItem(cart_id=carts[3].id, item_id=item3.id, quantity=1),
    ]
    db.session.add_all(cart_items)
    db.session.commit()

    print("✅ Seed data inserted.")
