# seed_data.py
from app import create_app
from app.extensions import db
from app.models import User, Item

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    user = User(name="Tanisha", email="tanisha@example.com")
    db.session.add(user)

    items = [
        Item(name="Keyboard", price=1299.99),
        Item(name="Mouse", price=599.50),
        Item(name="Monitor", price=9999.00)
    ]
    db.session.add_all(items)

    db.session.commit()
    print("✅ Sample user and items added.")
