import { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, PlusCircle, CheckCircle } from 'lucide-react';



function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [userId] = useState(1); // Static for now
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartId, setCartId] = useState(null);
  const [feedback, setFeedback] = useState('');

  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:5000/cart/view?user_id=${userId}`);
      const data = await res.ok ? await res.json() : [];
      setCartItems(data);
      setCartId(data.length > 0 ? data[0].cart_id : null);
    } catch (err) {
      console.error('❌ Fetch cart failed:', err);
      setCartItems([]);
      setCartId(null);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, item_id: Number(itemId), quantity: Number(quantity) }),
      });
      setFeedback('🛒 Item added to cart!');
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
        body: JSON.stringify({ cart_id: cartId, item_id: id }),
      });
      setFeedback('🗑️ Item removed.');
      fetchCart();
    } catch (err) {
      console.error('Remove failed:', err);
    }
  };

  const handleCheckout = async () => {
    if (!cartId) return;
    try {
      await fetch('http://localhost:5000/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_id: cartId }),
      });
      setFeedback('✅ Checkout complete!');
      fetchCart();
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen pt-24 px-6 bg-[#F8FAFC] font-inter">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-[#4C5C68] mb-6 text-center flex items-center justify-center gap-2">
          <ShoppingCart className="w-7 h-7" />
          My Cart
          </h2>


        {/* Add Item Form */}
        <form
          onSubmit={handleAddToCart}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4 mb-8"
        >
          <h3 className="text-lg font-medium text-gray-700">Add Item Manually</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder="Item ID"
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-2 focus:ring-[#4C5C68]/30"
            />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              placeholder="Qty"
              required
              className="w-24 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-2 focus:ring-[#4C5C68]/30"
            />
            <button
              type="submit"
              className="bg-[#4C5C68] hover:bg-[#5E7386] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Add
            </button>
          </div>
          {feedback && <p className="text-sm text-center text-gray-600">{feedback}</p>}
        </form>

        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Items in Cart</h3>
              <ul className="space-y-3">
                {cartItems.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div>
                      <p className="text-sm font-medium text-[#4C5C68]">
                        {item.item_name} <span className="text-gray-500">x {item.quantity}</span>
                      </p>
                      <p className="text-xs text-gray-500">ID: {item.item_id} | ₹{item.price}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.item_id)}
                      className="text-sm text-red-500 hover:text-red-600 transition flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="pt-4 text-right">
                <button
                  onClick={handleCheckout}
                  className="bg-[#10B981] hover:bg-[#0f9d77] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  Checkout
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 text-center mt-4">🛒 Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}

export default Cart;
