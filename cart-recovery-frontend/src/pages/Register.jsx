import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Register() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/register', form);
      const userId = res.data.id;

      setMessage(`✅ Registered! User ID: ${userId}`);

      // Save user info to localStorage
      localStorage.setItem('user', JSON.stringify({
        id: userId,
        name: form.name,
        email: form.email
      }));

      // Redirect to items page after short delay
      setTimeout(() => {
        navigate('/items');
      }, 1000);

    } catch (err) {
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 font-inter pt-24">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-center text-[#4C5C68] mb-1">
          Create Account
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          Enter your details to register
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:border-[#4C5C68] focus:ring-2 focus:ring-[#4C5C68]/30 outline-none transition"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm focus:border-[#4C5C68] focus:ring-2 focus:ring-[#4C5C68]/30 outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#4C5C68] hover:bg-[#5E7386] text-white text-sm font-semibold py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 text-center text-sm font-medium rounded-md p-2 ${
              message.startsWith('✅')
                ? 'text-green-600 bg-green-50'
                : 'text-red-600 bg-red-50'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
