from flask_mail import Message
from app.extensions import mail
from flask import current_app

def send_abandoned_cart_email(to_email, cart_id):
    subject = "🛒 You left items in your cart!"
    body = f"Hello,\n\nYou have items pending in your cart (ID: {cart_id}). Don't miss out—come back and complete your purchase!\n\nCheers,\nCart Recovery App Team"

    msg = Message(subject, recipients=[to_email], body=body)
    try:
        mail.send(msg)
        current_app.logger.info(f"Sent abandoned cart email to {to_email}")
    except Exception as e:
        current_app.logger.error(f"Email sending failed: {e}")
