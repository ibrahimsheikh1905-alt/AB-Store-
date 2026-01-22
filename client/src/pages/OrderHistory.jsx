import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ordersAPI, reviewsAPI } from '../utils/api';
import { formatPriceWithDecimals } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { FaCheckCircle, FaTimesCircle, FaShoppingBag, FaStar } from 'react-icons/fa';

const OrderHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    if (user) {
      fetchReviews();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getUserReviews();
      setReviews(response.data);
    } catch (error) {
      // Silently handle auth errors - user might not be logged in
      if (error.response?.status !== 401) {
        console.error('Error fetching reviews:', error);
      }
      setReviews([]);
    }
  };

  const hasReviewedProduct = (productId) => {
    return reviews.some(review => review.product?._id === productId || review.product === productId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-600">View all your past orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <div className="flex items-center gap-2">
                      {order.isPaid ? (
                        <span className="flex items-center gap-1 text-green-600 font-semibold">
                          <FaCheckCircle />
                          Paid
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 font-semibold">
                          <FaTimesCircle />
                          Unpaid
                        </span>
                      )}
                      {order.isDelivered ? (
                        <span className="flex items-center gap-1 text-green-600 font-semibold">
                          <FaCheckCircle />
                          Delivered
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                          Pending Delivery
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      Total: {formatPriceWithDecimals(order.totalPrice)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Order Items:</h4>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => {
                    const reviewed = hasReviewedProduct(item.product);
                    return (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                        <img
                          src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/products/${item.product}`}
                            className="text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × {formatPriceWithDecimals(item.price)}
                          </p>
                          {order.isPaid && (
                            <div className="mt-3">
                              {reviewed ? (
                                <div className="flex items-center gap-1 text-sm text-green-600">
                                  <FaStar className="text-xs" />
                                  <span>You have reviewed this product</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => navigate(`/products/${item.product}#reviews`)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                                >
                                  <FaStar />
                                  Add Review
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatPriceWithDecimals(item.price * item.quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Shipping Address:</h4>
                  <p className="text-gray-600">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
