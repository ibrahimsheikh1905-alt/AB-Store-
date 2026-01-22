import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = getCartItemsCount();
  const [showSearch, setShowSearch] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  const slides = [
    'FREE EXPRESS DELIVERY IN 48 HOURS • ALL METRO CITIES',
    'UP TO 45% OFF ON SIGNATURE SERIES • LIMITED TIME',
    'CASH ON DELIVERY AVAILABLE • EASY 7-DAY RETURNS',
    'BUY 2 GET EXTRA 10% OFF • USE CODE: ABSTORE10',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);
  
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Promotional Slider Bar */}
      {!isAdminRoute && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />

          <div className="container mx-auto px-4">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 py-3 flex items-center justify-center text-[11px] md:text-sm font-semibold uppercase tracking-[0.3em] whitespace-nowrap drop-shadow-sm"
                >
                  {slide}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 transform flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${currentSlide === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <header className="bg-black text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
             onClick={() => setMobileMenu(!mobileMenu)}
             className="lg:hidden p-2 text-white"
            >
            ☰
            </button>
            {mobileMenu && !isAdminRoute && (
            <div className="lg:hidden bg-black border-t border-gray-800">
            <nav className="flex flex-col px-4 py-4 space-y-4">
            <Link to="/" className="font-bold uppercase">Home</Link>
            <Link to="/collections" className="font-bold uppercase">Collection</Link>
            <Link to="/products" className="font-bold uppercase">All Products</Link>
            </nav>
            </div>
                )}

            {/* Logo */}
            <Link
              to={isAdminRoute ? '/admin' : '/'}
              className={`flex items-center gap-3 text-2xl font-black tracking-wider uppercase text-white transition-all duration-300 hover:scale-110 ${
                isAdminRoute ? '' : 'hover:text-orange-500'
              }`}
            >
              <img
                src="/abstore-logo.svg"
                alt="AB STORE"
                className="h-10 w-10 object-contain drop-shadow-lg"
              />
              <span>AB STORE</span>
            </Link>

            {/* Navigation Links */}
            {!isAdminRoute && (
              <nav className="hidden lg:flex items-center space-x-8">
                <Link to="/" className="text-sm font-bold uppercase tracking-wider text-white hover:text-orange-500 transition">
                  HOME
                </Link>
                <Link to="/collections" className="text-sm font-bold uppercase tracking-wider text-white hover:text-orange-500 transition">
                  COLLECTION
                </Link>
                <Link to="/products" className="text-sm font-bold uppercase tracking-wider text-white hover:text-orange-500 transition">
                  ALL PRODUCTS
                </Link>
              </nav>
            )}

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {isAdminRoute ? (
                <Link to="/admin" className="text-sm font-bold uppercase tracking-wider hover:text-yellow-400 transition">
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  {/* Search Icon */}
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="relative p-2 text-white hover:text-orange-500 transition-all duration-300 transform hover:scale-110"
                    aria-label="Search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>

                  {/* Cart Icon */}
                  <Link to="/cart" className="relative p-2 text-white hover:text-orange-500 transition-all duration-300 transform hover:scale-110" aria-label="Cart">
                    <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce-in transition-all duration-300 hover:scale-125">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* User Icon */}
                  {user ? (
                    <div className="relative group">
                      <button className="p-2 text-white hover:text-orange-500 transition" aria-label="Account">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-200 animate-slide-down">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        {!user.isAdmin && (
                          <Link
                            to="/orders"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Order History
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link to="/login" className="p-2 text-white hover:text-orange-500 transition" aria-label="Login">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Search Bar (appears when search icon is clicked) */}
          {showSearch && !isAdminRoute && (
            <div className="border-t border-gray-800 py-4 bg-gray-900">
              <div className="flex items-center max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-l-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  autoFocus
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-r-lg font-semibold transition">
                  Search
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
