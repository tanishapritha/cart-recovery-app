from datetime import datetime, timedelta
from app.models import Cart, AbandonmentLog, EmailLog
from app.extensions import db

def check_abandoned_carts(app):
    with app.app_context():
        threshold = datetime.utcnow() - timedelta(seconds=10)  # For testing

        abandoned_carts = Cart.query.filter(
            Cart.status == 'active',
            Cart.last_updated < threshold
        ).all()

        for cart in abandoned_carts:
            cart.status = 'abandoned'

            # Log abandonment only once
            existing_log = AbandonmentLog.query.filter_by(cart_id=cart.id).first()
            if not existing_log:
                db.session.add(AbandonmentLog(cart_id=cart.id))

                # Simulate email sending (just log it, don't actually send)
                if cart.user and cart.user.email:
                    db.session.add(EmailLog(
                        email=cart.user.email,
                        subject="🛒 Don't forget your cart!",
                        body=f"Hey {cart.user.name}, you left items in your cart. Come back and complete your purchase!"
                    ))

            print(f"🔕 Marked cart {cart.id} as abandoned (User ID: {cart.user_id})")

        db.session.commit()
