import { useEffect, useState } from 'react';

function AbandonedCarts() {
  const [abandonedCarts, setAbandonedCarts] = useState([]);

  useEffect(() => {
    const fetchAbandoned = async () => {
      try {
        const res = await fetch('http://localhost:5000/cart/report');
        const data = await res.json();
        if (res.ok) {
          setAbandonedCarts(data);
        } else {
          setAbandonedCarts([]);
        }
      } catch (err) {
        console.error('Error fetching abandoned carts:', err);
      }
    };

    fetchAbandoned();
  }, []);

  return (
    <div>
      <h2>🛒 Abandoned Carts</h2>
      {abandonedCarts.length === 0 ? (
        <p>No abandoned carts found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Cart ID</th>
              <th>User ID</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {abandonedCarts.map((cart) => (
              <tr key={cart.cart_id}>
                <td>{cart.cart_id}</td>
                <td>{cart.user_id}</td>
                <td>{new Date(cart.last_updated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AbandonedCarts;
