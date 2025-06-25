from flask import Flask
from apscheduler.schedulers.background import BackgroundScheduler
from app.extensions import db  # ✅ import db from extensions
from flask_cors import CORS
from flask_mail import Mail

mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.update(
        MAIL_SERVER='smtp.gmail.com',
        MAIL_PORT=587,
        MAIL_USE_TLS=True,
        MAIL_USERNAME='your_email@gmail.com',
        MAIL_PASSWORD='your_app_password',  # Use app password if Gmail
        MAIL_DEFAULT_SENDER='your_email@gmail.com'
    )

    mail.init_app(app)


    CORS(app, resources={r"/*": {"origins": "*"}})

    app.config.from_object('app.config.Config')

    db.init_app(app)

    # ⏩ Delay importing until after app is ready to prevent circular import
    from .routes import cart, user, item
    from .utils.scheduler import check_abandoned_carts

    app.register_blueprint(cart.bp)
    app.register_blueprint(user.bp)
    app.register_blueprint(item.bp)

    scheduler = BackgroundScheduler()
    scheduler.add_job(func=lambda: check_abandoned_carts(app), trigger="interval", minutes=5)
    scheduler.start()


    @app.route("/")
    def home():
        return "✅ Flask App is Running"

    return app

