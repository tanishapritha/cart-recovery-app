# Cart Recovery System
---
This is a backend system built with Flask for monitoring and managing abandoned carts in an e-commerce context. A basic HTML frontend page displays abandoned carts for business insight.
https://cart-recovery-app.vercel.app/


## Features

- User registration and cart creation
- Add and remove items from cart
- Checkout functionality
- Automatically detect and mark carts as "abandoned" after a period of inactivity
- Logs abandoned carts for tracking
- Displays a simple abandoned cart report in the browser

---

## How the Backend Works

### Data Models

- **User** – Stores name and email
- **Item** – Represents products (name and price)
- **Cart** – Linked to a user; tracks cart status (`active`, `abandoned`) and last update
- **CartItem** – Associates items with a specific cart and quantity
- **AbandonmentLog** – Records when a cart is marked abandoned (once per cart)

### Inactivity Detection Logic

- When a user adds/removes items, or checks out, the cart's `last_updated` field is refreshed.
- A background job (via `apscheduler`) runs every few minutes:
  - Finds carts inactive for more than a threshold (e.g., 10 minutes)
  - Marks them as `"abandoned"` and logs the event

---

## User Flow

**If the user does not checkout:**
- The cart stays `active` for a while
- If untouched for too long, it is marked `abandoned` and shown in reports

**If the user checks out:**
- The cart is removed from further processing
- It will never be marked as abandoned

---

## API Endpoints

| Method | Route                | Description                          |
|--------|----------------------|--------------------------------------|
| POST   | `/user/register`     | Register a new user                  |
| GET    | `/user/all`          | List all users                       |
| GET    | `/item/all`          | View all available items             |
| POST   | `/item/add`          | Add a new item                       |
| POST   | `/cart/add`          | Add item to cart                     |
| POST   | `/cart/remove`       | Remove item from cart                |
| GET    | `/cart/view`         | View current user cart               |
| POST   | `/cart/checkout`     | Checkout and clear cart              |
| GET    | `/cart/report`       | Get abandoned cart data (JSON)       |
| GET    | `/cart/abandoned`    | HTML view of abandoned carts         |

---

## Screenshots

- [Register](screenshots/register.png)
- [Items](screenshots/add-to-cart.png)
- [Checkout](screenshots/confirm-checkout.png)
- [Abandoned Cart DB](screenshots/abandoned.png)

---

## Setup (Local Only)

> ⚠️ The backend is not deployed yet. Use these steps to run it locally.

### 1. Clone the project

```bash
git clone https://github.com/yourusername/cart-recovery.git
cd cart-recovery
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
# For Windows:
venv\Scripts\activate
# For Mac/Linux:
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the app

```bash
flask --app app:create_app run
```

### 5. Seed sample data (optional)

```bash
python seed_data.py
```

### 6. Open the frontend report

Visit in browser:

```
http://localhost:5000/cart/abandoned
```

This will show a simple HTML report of all abandoned carts.

---

## Tech Stack

- Python + Flask
- SQLite
- APScheduler
- HTML/CSS for report page

---
