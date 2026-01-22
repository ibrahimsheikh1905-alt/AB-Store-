import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatPriceWithDecimals, convertToPKR } from '../utils/currency';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-8 text-gray-800">
            <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
            <svg className="w-9 h-9 text-orange-500 translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l1 7h12l1.5-5H6" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16a2 2 0 11-4 0 2 2 0 014 0zM9 16a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <Link
            to="/products"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition inline-block mt-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal() || 0;
  const shipping = subtotal > 28000 ? 0 : 2800; // Free shipping over 28,000 PKR, otherwise 2,800 PKR
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-slide-down">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
                 <div className="bg-white rounded-lg shadow-md overflow-hidden">
                   {cartItems.map((item, index) => (
                     <div key={item._id} className="border-b border-gray-200 last:border-b-0 p-6 animate-fade-in-up transition-all duration-300 hover:bg-gray-50" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                    }}
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600">{formatPriceWithDecimals(item.price)}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                             <button
                               onClick={() => updateQuantity(item._id, item.quantity - 1)}
                               className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-all duration-300 transform hover:scale-110 active:scale-95"
                             >
                               -
                             </button>
                             <span className="w-8 text-center transition-all duration-300">{item.quantity}</span>
                             <button
                               onClick={() => updateQuantity(item._id, item.quantity + 1)}
                               className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded transition-all duration-300 transform hover:scale-110 active:scale-95"
                             >
                               +
                             </button>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 w-32 text-right">
                      {formatPriceWithDecimals(item.price * item.quantity)}
                    </p>
                           <button
                             onClick={() => removeFromCart(item._id)}
                             className="text-red-600 hover:text-red-700 transition-all duration-300 transform hover:scale-125 active:scale-95"
                           >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={clearCart}
            className="mt-4 text-red-600 hover:text-red-700 font-semibold"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPriceWithDecimals(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPriceWithDecimals(shipping)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span>{formatPriceWithDecimals(total)}</span>
              </div>
            </div>
                   <button
                     onClick={handleCheckout}
                     className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
                   >
                     Proceed to Checkout
                   </button>
            <Link
              to="/products"
              className="block text-center text-primary-600 hover:text-primary-700 mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
