import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

function Checkout() {
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [message, setMessage] = useState('');
  const userId = 1;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/cart/view?user_id=${userId}`);
        if (!res.ok) throw new Error('No active cart');
        const data = await res.json();
        setCartId(data.cart_id);
        setItems(data.items);
      } catch {
        setMessage('🛒 No active cart found.');
      }
    };
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!cartId) return;
    try {
      const res = await fetch('http://localhost:5000/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_id: cartId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Checkout successful!');
        setItems([]);
      } else {
        setMessage(data.message || '❌ Checkout failed.');
      }
    } catch {
      setMessage('❌ Network error.');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen pt-24 bg-[#F8FAFC] px-6 font-inter">
      <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">
        <h2 className="text-3xl font-bold text-[#4C5C68] flex items-center justify-center gap-2">
          <CheckCircle className="w-7 h-7" />
          Checkout
        </h2>

        {items.length > 0 ? (
          <>
            <ul className="space-y-3">
              {items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span>{item.item_name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="text-right font-semibold text-[#4C5C68]">
              Total: ₹{total}
            </div>
            <div className="text-center">
              <button
                onClick={handleCheckout}
                className="bg-[#4C5C68] hover:bg-[#5E7386] text-white px-6 py-2 rounded-md text-sm font-medium shadow transition"
              >
                Confirm Checkout
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600 text-center">{message}</p>
        )}

        {message && items.length === 0 && (
          <p className="text-sm text-gray-700 bg-gray-100 rounded-md px-4 py-2">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Checkout;
