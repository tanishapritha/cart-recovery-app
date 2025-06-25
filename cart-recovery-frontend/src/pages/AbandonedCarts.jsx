import { useEffect, useState } from 'react';
import { Ban, Info } from 'lucide-react';

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
    <div className="min-h-screen pt-24 px-6 bg-[#F8FAFC] font-inter">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        {/* Heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#4C5C68] flex items-center gap-2">
            <Ban className="w-7 h-7" />
            Abandoned Carts Report
          </h2>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Carts that haven’t been checked out recently
          </div>
        </div>

        {/* Conditional UI */}
        {abandonedCarts.length === 0 ? (
          <div className="text-center text-sm text-gray-600 py-6">
            🧼 No abandoned carts found. Customers are converting well!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-[#4C5C68] text-white uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3">Cart ID</th>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {abandonedCarts.map((cart) => (
                  <tr key={cart.cart_id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 font-medium text-[#4C5C68]">{cart.cart_id}</td>
                    <td className="px-4 py-2">{cart.user_id}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {new Date(cart.last_updated).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-xs text-gray-400 mt-4">
              Showing {abandonedCarts.length} cart{abandonedCarts.length > 1 ? 's' : ''} with no recent activity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AbandonedCarts;
