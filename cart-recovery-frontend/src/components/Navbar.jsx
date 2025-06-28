import { Link } from 'react-router-dom';

function Navbar() {
  const links = [
    { name: 'Register', path: '/' },
    { name: 'Items', path: '/items' },
    { name: 'Cart', path: '/cart' },
    { name: 'Checkout', path: '/checkout' },

  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#4C5C68] px-6 py-4 shadow-md font-inter">
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className="relative text-gray-100 text-sm font-medium px-4 py-2 rounded-md transition-all duration-200 hover:bg-[#5e6f7c] hover:shadow hover:scale-[1.03]"
          >
            <span className="relative z-10">{link.name}</span>
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-white transition-all duration-300 hover:w-full"></span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
