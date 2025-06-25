import { useEffect, useState } from 'react';
import { ShoppingCart, PlusCircle } from 'lucide-react'; // install with: npm i lucide-react

function Items() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('http://localhost:5000/item/all');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) return setFeedback('⚠️ Enter valid name and price');

    try {
      setIsSubmitting(true);
      const res = await fetch('http://localhost:5000/item/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price) }),
      });

      const data = await res.json();
      if (res.ok) {
        setName('');
        setPrice('');
        setFeedback('✅ Item added!');
        fetchItems();
      } else {
        setFeedback(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error('❌ Error adding item:', err);
      setFeedback('❌ Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      const res = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 1, item_id: itemId, quantity: 1 }),
      });

      const data = await res.json();
      if (res.ok) setFeedback('🛒 Added to cart!');
      else setFeedback(`❌ ${data.error || 'Add to cart failed'}`);
    } catch (err) {
      console.error('❌ Cart error:', err);
      setFeedback('❌ Network error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-10 font-inter pt-24">

      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-[#4C5C68] mb-6 text-center flex items-center justify-center gap-2">
          <ShoppingCart className="w-7 h-7" />
          Shop Items
        </h2>

        {/* Add Item Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-10 space-y-5">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name"
              required
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-[#4C5C68]/30 focus:outline-none"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              required
              min="0"
              step="0.01"
              className="w-36 border border-gray-300 rounded-md px-4 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-[#4C5C68]/30 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1 bg-[#4C5C68] hover:bg-[#5E7386] text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </button>
          </div>
          {feedback && (
            <p className="text-sm text-center text-gray-600 mt-2">{feedback}</p>
          )}
        </form>

        {/* Item List */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Available Items</h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">No items found.</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold text-[#4C5C68]">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                    <button
                      onClick={() => handleAddToCart(item.id)}
                      className="mt-2 bg-[#10B981] hover:bg-[#0f9d77] text-white text-sm px-4 py-1.5 rounded-md transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Items;
