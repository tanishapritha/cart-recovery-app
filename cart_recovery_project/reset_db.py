from app import create_app
from app.extensions import db
from app.models import Cart, AbandonmentLog

app = create_app()

with app.app_context():

    AbandonmentLog.query.delete()

    Cart.query.filter_by(status='abandoned').delete()

    db.session.commit()
    print("Abandoned carts and logs cleared.")
