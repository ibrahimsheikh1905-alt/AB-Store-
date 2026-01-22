import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaStar } from 'react-icons/fa';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Auto redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center animate-fade-in">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
            <FaCheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-slide-down">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-gray-600 mb-2 animate-slide-down" style={{ animationDelay: '0.1s' }}>
          Thank you for your purchase!
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-8 animate-slide-down" style={{ animationDelay: '0.2s' }}>
            Order ID: <span className="font-semibold">{orderId}</span>
          </p>
        )}
        <p className="text-base text-gray-700 mb-8 animate-slide-down" style={{ animationDelay: '0.3s' }}>
          We've received your order and will process it shortly. You will receive a confirmation email shortly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <FaShoppingBag />
            View Order History
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t border-gray-200 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <p className="text-sm text-gray-600 mb-4">
            What's next?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-900 mb-1">Order Processing</h3>
              <p className="text-sm text-gray-600">We'll prepare your order for shipment</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="font-semibold text-gray-900 mb-1">Shipping</h3>
              <p className="text-sm text-gray-600">Your order will be shipped to your address</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">⭐</div>
              <h3 className="font-semibold text-gray-900 mb-1">Review & Rate</h3>
              <p className="text-sm text-gray-600">Share your experience after receiving</p>
            </div>
          </div>
        </div>

        {/* Auto Redirect Notice */}
        <p className="mt-8 text-xs text-gray-500 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          You will be redirected to home page in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
