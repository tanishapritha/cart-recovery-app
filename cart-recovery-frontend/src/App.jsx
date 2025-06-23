import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Items from './pages/Items';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AbandonedCarts from './pages/AbandonedCarts';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/items" element={<Items />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/abandoned-carts" element={<AbandonedCarts />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
