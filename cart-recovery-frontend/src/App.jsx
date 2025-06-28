import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Items from './pages/Items';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';





function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/items" element={<Items />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
