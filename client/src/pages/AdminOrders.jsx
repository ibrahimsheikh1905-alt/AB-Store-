import { useEffect, useState } from 'react';
import { adminAPI } from '../utils/api';
import { formatPriceWithDecimals } from '../utils/currency';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (orderId) => {
    try {
      await adminAPI.updateOrderPayment(orderId);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order');
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await adminAPI.updateOrderDelivery(orderId);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">All Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-600">
                  Customer: {order.user?.name || 'N/A'} ({order.user?.email || 'N/A'})
                </p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">
                  {formatPriceWithDecimals(order.totalPrice)}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  {order.isPaid ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      Paid
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">
                      Not Paid
                    </span>
                  )}
                  {order.isDelivered ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      Delivered
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Order Items:</h4>
              <div className="space-y-2">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image ? (item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL.replace('/api', '')}${item.image}`) : 'https://via.placeholder.com/100x100?text=No+Image'}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-gray-800">{formatPriceWithDecimals(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Shipping Address:</h4>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </p>
            </div>

            <div className="mt-4 flex space-x-3">
              {!order.isPaid && (
                <button
                  onClick={() => handleMarkPaid(order._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Mark as Paid
                </button>
              )}
              {order.isPaid && !order.isDelivered && (
                <button
                  onClick={() => handleMarkDelivered(order._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Mark as Delivered
                </button>
              )}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
