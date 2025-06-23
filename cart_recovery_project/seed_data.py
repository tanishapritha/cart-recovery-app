from app import create_app
from app.extensions import db
from app.models import User, Item

app = create_app()

with app.app_context():
    # Drop all just in case (optional)
    db.drop_all()
    db.create_all()

    # Add one user
    user = User(name="Test User", email="test@example.com")
    db.session.add(user)

    # Add some items
    items = [
        Item(name="Keyboard", price=1299.99),
        Item(name="Mouse", price=599.50),
        Item(name="Monitor", price=9999.00)
    ]
    db.session.add_all(items)

    db.session.commit()
    print("✅ Sample user and items added.")
