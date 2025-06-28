from flask import Flask
from apscheduler.schedulers.background import BackgroundScheduler
from flask_cors import CORS

from app.extensions import db
from app.utils.scheduler import check_abandoned_carts

def create_app():
    app = Flask(__name__)

    # Removed Mail Configuration

    # Load additional config
    app.config.from_object('app.config.Config')

    # Initialize extensions
    db.init_app(app)

    CORS(app, resources={r"/*": {"origins": "*"}})

    # Register blueprints
    from app.routes import cart, user, item
    app.register_blueprint(cart.bp)
    app.register_blueprint(user.bp)
    app.register_blueprint(item.bp)

    # Start background scheduler
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=lambda: check_abandoned_carts(app), trigger="interval", minutes=5)
    scheduler.start()

    # Home route
    @app.route("/")
    def home():
        return "✅ Flask App is Running"

    return app
