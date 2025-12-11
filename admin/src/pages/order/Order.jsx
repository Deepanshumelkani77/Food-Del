import React, { useState, useEffect } from 'react';
import "./Order.css";
import { FaCheckCircle, FaTruck, FaSearch, FaFilter, FaSort } from 'react-icons/fa';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://food-del-0kcf.onrender.com/order');
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
          console.log(data.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://food-del-0kcf.onrender.com/order/update-status/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Filter and sort orders
  const filteredAndSortedOrders = orders
    .filter(order => {
      const matchesSearch = 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'price-high') {
        return b.totalAmount - a.totalAmount;
      } else if (sortBy === 'price-low') {
        return a.totalAmount - b.totalAmount;
      }
      return 0;
    });

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-badge status-pending';
      case 'confirmed':
        return 'status-badge status-confirmed';
      case 'preparing':
        return 'status-badge status-preparing';
      case 'out-for-delivery':
        return 'status-badge status-out-for-delivery';
      case 'delivered':
        return 'status-badge status-delivered';
      case 'cancelled':
        return 'status-badge status-cancelled';
      default:
        return 'status-badge';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate total sales
  const totalSales = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  // Count orders by status
  const orderCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="orders-container">
      <div className="orders-header">
        <div>
          <h1>Order Management</h1>
          <p>Manage and track all customer orders</p>
        </div>
        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-value">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">${totalSales.toFixed(2)}</span>
            <span className="stat-label">Total Sales</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{orderCounts.delivered || 0}</span>
            <span className="stat-label">Delivered</span>
          </div>
        </div>
      </div>

      <div className="orders-toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="filter-group">
            <FaSort className="filter-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading orders...</div>
      ) : filteredAndSortedOrders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredAndSortedOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <span className="order-date">{formatDate(order.createdAt)}</span>
                </div>
                <div className={getStatusBadgeClass(order.status)}>
                  {order.status.replace(/-/g, ' ')}
                </div>
              </div>
              
              <div className="order-details">
                <div className="customer-info">
                  <h4>Customer</h4>
                  <p>{order.name || 'Guest User'}</p>
                  <p>{order.phone || 'N/A'}</p>
                  <p>{order.address || 'N/A'}</p>
                </div>
                
                <div className="order-summary">
                  <h4>Order Summary</h4>
                  <div className="order-items">
                    {order.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <span className="item-name">{item.food.name} × {item.quantity}</span>
                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <span>Total:</span>
                    <span>${order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="order-actions">
                  <h4>Order Status</h4>
                  <div className="status-actions">
                    {order.status === 'pending' && (
                      <button 
                        className="btn-confirm"
                        onClick={() => updateOrderStatus(order._id, 'confirmed')}
                      >
                        <FaCheckCircle /> Confirm Order
                      </button>
                    )}
                    
                    {order.status === 'confirmed' && (
                      <button 
                        className="btn-preparing"
                        onClick={() => updateOrderStatus(order._id, 'preparing')}
                      >
                        <FaTruck /> Start Preparing
                      </button>
                    )}
                    
                    {order.status === 'preparing' && (
                      <button 
                        className="btn-out-for-delivery"
                        onClick={() => updateOrderStatus(order._id, 'out-for-delivery')}
                      >
                        <FaTruck /> Out for Delivery
                      </button>
                    )}
                    
                    {order.status === 'out-for-delivery' && (
                      <button 
                        className="btn-delivered"
                        onClick={() => updateOrderStatus(order._id, 'delivered')}
                      >
                        <FaCheckCircle /> Mark as Delivered
                      </button>
                    )}
                    
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button 
                        className="btn-cancel"
                        onClick={() => updateOrderStatus(order._id, 'cancelled')}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="order-footer">
                <div className="payment-info">
                  <span>Payment: </span>
                  <span className={`payment-status ${order.paymentStatus === 'paid' ? 'paid' : 'unpaid'}`}>
                    {order.paymentStatus || 'unpaid'}
                  </span>
                </div>
                <button 
                  className="btn-view-details"
                  onClick={() => console.log('View order details', order._id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
