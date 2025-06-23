import { useEffect, useState } from 'react';

function Cart() {
  const [cart, setCart] = useState(null);
  const [userId] = useState(1); // Static for now
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:5000/cart/view?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      } else {
        setCart(null);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setCart(null);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          item_id: Number(itemId),
          quantity: Number(quantity)
        }),
      });
      setItemId('');
      setQuantity(1);
      fetchCart();
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await fetch('http://localhost:5000/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_id: cart?.cart_id,
          item_id: id
        }),
      });
      fetchCart();
    } catch (err) {
      console.error('Remove item failed:', err);
    }
  };

  const handleCheckout = async () => {
    if (!cart?.cart_id) return;
    try {
      await fetch('http://localhost:5000/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_id: cart.cart_id
        }),
      });
      fetchCart();
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div>
      <h2>🛒 Cart</h2>

      <form onSubmit={handleAddToCart}>
        <input
          type="number"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          placeholder="Item ID"
          required
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          min="1"
          required
        />
        <button type="submit">Add to Cart</button>
      </form>

      {cart?.items?.length > 0 ? (
        <>
          <ul>
            {cart.items.map((item, idx) => (
              <li key={idx}>
                ID: {item.item_id}, {item.name} — ₹{item.price} × {item.quantity}
                <button
                  onClick={() => handleRemoveItem(item.item_id)}
                  style={{ marginLeft: '10px' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button onClick={handleCheckout} style={{ marginTop: '10px' }}>
            ✅ Checkout
          </button>
        </>
      ) : (
        <p>No items in cart.</p>
      )}
    </div>
  );
}

export default Cart;
