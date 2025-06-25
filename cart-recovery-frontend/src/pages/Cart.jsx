import { useEffect, useState } from 'react';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [items, setItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [cartId, setCartId] = useState(null);
  const [message, setMessage] = useState('');
  const userId = 1;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/cart/view?user_id=${userId}`);
        if (!res.ok) throw new Error('Cart not found');
        const data = await res.json();
        setCartId(data.cart_id);
        setItems(data.items);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setMessage('🛒 Your cart is empty.');
        setItems([]);
      }
    };
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen pt-24 px-6 bg-[#F8FAFC] font-inter">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-[#4C5C68] mb-6 text-center flex items-center justify-center gap-2">
          <ShoppingCart className="w-7 h-7" />
          My Cart
        </h2>

        {items.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
            <ul className="space-y-3">
              {items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span>{item.item_name} x {item.quantity}</span>
                  <span>₹{item.price}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 text-right">
              <button
                onClick={() => navigate('/checkout')}
                className="bg-[#10B981] hover:bg-[#0f9d77] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition"
              >
                <CheckCircle className="w-4 h-4" />
                Checkout
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Cart;
