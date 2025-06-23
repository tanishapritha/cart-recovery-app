import { useEffect, useState } from 'react';

function Checkout() {
  const [cartId, setCartId] = useState(null);
  const userId = 1; // replace with dynamic user if needed
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/cart/view?user_id=${userId}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data) && data.length > 0) {
          setCartId(data[0].cart_id);
        } else {
          setMessage('No active cart found.');
        }
      } catch (err) {
        setMessage('Error fetching cart.');
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!cartId) {
      setMessage('No cart to checkout.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_id: cartId })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Checkout successful!');
      } else {
        setMessage(data.message || 'Checkout failed.');
      }
    } catch (err) {
      setMessage('Network error.');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      {cartId && <p>Cart ID: {cartId}</p>}
      <button onClick={handleCheckout}>Checkout</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Checkout;
