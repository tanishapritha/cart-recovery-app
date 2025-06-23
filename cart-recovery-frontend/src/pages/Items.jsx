import { useEffect, useState } from 'react';

function Items() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all items
  const fetchItems = async () => {
    try {
      const res = await fetch('http://localhost:5000/item/all');
      const data = await res.json();
      console.log('✅ Fetched items:', data);
      setItems(data);
    } catch (err) {
      console.error('❌ Failed to fetch items:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Submit new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      alert('⚠️ Please enter both name and price');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('http://localhost:5000/item/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price) }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Item added successfully!');
        setName('');
        setPrice('');
        fetchItems();
      } else {
        alert(`❌ Failed to add item: ${data.error}`);
      }
    } catch (err) {
      console.error('❌ Error adding item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add to cart
  const handleAddToCart = async (itemId) => {
    try {
      const res = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1, // replace later with dynamic user
          item_id: itemId,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('🛒 Item added to cart');
      } else {
        alert(`❌ ${data.error || 'Failed to add to cart'}`);
      }
    } catch (err) {
      console.error('❌ Add to cart error:', err);
    }
  };

  return (
    <div>
      <h2>🧾 Items</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          min="0"
          step="0.01"
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </button>
      </form>

      <h3>📦 All Items</h3>
      <ul>
        {items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          items.map((item) => (
            <li key={item.id}>
              {item.name} — ₹{item.price.toFixed(2)}{' '}
              <button onClick={() => handleAddToCart(item.id)}>Add to Cart</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Items;
