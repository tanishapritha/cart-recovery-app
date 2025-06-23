import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: '10px', background: '#f4f4f4' }}>
      <Link to="/" style={{ marginRight: '15px' }}>Register</Link>
      <Link to="/items" style={{ marginRight: '15px' }}>Items</Link>
      <Link to="/cart" style={{ marginRight: '15px' }}>Cart</Link>
      <Link to="/checkout" style={{ marginRight: '15px' }}>Checkout</Link>
      <Link to="/abandoned-carts">Abandoned Carts</Link>
    </nav>
  );
}

export default Navbar;
