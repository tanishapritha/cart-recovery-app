import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

function Checkout() {
  const [cartId, setCartId] = useState(null);
  const [message, setMessage] = useState('');
  const userId = 1;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/cart/view?user_id=${userId}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data) && data.length > 0) {
          setCartId(data[0].cart_id);
        } else {
          console.warn('Unexpected cart response:', data);
          setMessage('🛒 No active cart found.');
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        setMessage('⚠️ Error fetching cart.');
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!cartId) {
      setMessage('⚠️ No cart to checkout.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_id: cartId }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Checkout successful!');
        setCartId(null); // Clear cart
      } else {
        setMessage(data.message || '❌ Checkout failed.');
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      setMessage('❌ Network error.');
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-[#F8FAFC] px-6 font-inter">
      <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center space-y-4">
        <h2 className="text-3xl font-bold text-[#4C5C68] flex items-center justify-center gap-2">
          <CheckCircle className="w-7 h-7" />
          Checkout
        </h2>

        {cartId && (
          <p className="text-sm text-gray-600">
            🛒 Your cart ID: <span className="font-medium text-[#4C5C68]">{cartId}</span>
          </p>
        )}

        <button
          onClick={handleCheckout}
          disabled={!cartId}
          className={`px-6 py-2 rounded-md text-sm font-medium transition shadow ${
            cartId
              ? 'bg-[#4C5C68] hover:bg-[#5E7386] text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Confirm Checkout
        </button>

        {message && (
          <p className="text-sm text-gray-700 bg-gray-100 rounded-md px-4 py-2 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Checkout;
