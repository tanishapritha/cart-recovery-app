from datetime import datetime, timedelta
from app.models import Cart, AbandonmentLog
from app.extensions import db

def check_abandoned_carts(app):
    with app.app_context():
        threshold = datetime.utcnow() - timedelta(minutes=10)
        abandoned_carts = Cart.query.filter(
            Cart.status == 'active',
            Cart.last_updated < threshold
        ).all()

        for cart in abandoned_carts:
            cart.status = 'abandoned'
            log = AbandonmentLog(cart_id=cart.id)
            db.session.add(log)
        
        db.session.commit()
