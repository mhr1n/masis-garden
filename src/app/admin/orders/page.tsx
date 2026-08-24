'use client';

import { useState } from 'react';
import { useOrders, OrderStatus } from '../../../context/OrdersContext';
import { useCRM } from '../../../context/CRMContext';

export default function OrdersAdminPage() {
  const { orders, updateOrderStatus } = useOrders();
  const { sendConfirmationEmail } = useCRM();
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  // Filter and sort orders by most recent first
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const sortedOrders = [...filteredOrders].sort((a, b) => b.createdAt - a.createdAt);

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'pending': return { bg: '#2d2d14', color: '#e5d762', text: 'Pending' };
      case 'processing': return { bg: '#1a2a3a', color: '#6ab0ff', text: 'Processing' };
      case 'delivered': return { bg: '#1e3323', color: '#8fbc6a', text: 'Delivered' };
      case 'cancelled': return { bg: '#3a1a1a', color: '#ff6b6b', text: 'Cancelled' };
    }
  };

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>Orders Dashboard</h1>
          <p>Manage customer orders and track fulfillment</p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Orders ({sortedOrders.length})</h2>
          
          <div style={{ display: 'flex', gap: '8px', background: '#131810', padding: '4px', borderRadius: '8px', border: '1px solid #2a3528' }}>
            {['all', 'pending', 'processing', 'delivered', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                style={{
                  background: filter === f ? '#2a3528' : 'transparent',
                  color: filter === f ? '#fff' : '#888',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontSize: '0.85rem',
                  fontWeight: filter === f ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {sortedOrders.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>No orders yet!</h3>
            <p>Customer orders will appear here once they checkout.</p>
          </div>
        ) : (
          <div className="orders-list">
            {sortedOrders.map(order => {
              const statusStyle = getStatusColor(order.status);
              
              return (
                <div key={order.id} className="order-card">
                  
                  {/* Header */}
                  <div className="order-card-header">
                    <div>
                      <h3 style={{ color: '#e8eee5', margin: '0 0 8px 0', fontSize: '1.25rem' }}>Order #{order.id.slice(4, 12)}</h3>
                      <span style={{ fontSize: '0.85rem', color: '#6a7a65' }}>
                        Placed: {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="order-card-status">
                      <span style={{ 
                        background: statusStyle.bg, 
                        color: statusStyle.color, 
                        padding: '6px 12px', 
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        border: `1px solid ${statusStyle.color}40`
                      }}>
                        {statusStyle.text}
                      </span>
                      
                      <select 
                        value={order.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as OrderStatus;
                          updateOrderStatus(order.id, newStatus);
                          
                          // Email Automation
                          const customerId = (order.customerInfo.email || order.customerInfo.phone || order.id).toLowerCase().trim();
                          
                          if (newStatus === 'processing') {
                            sendConfirmationEmail(
                              customerId,
                              `Your Order #${order.id.slice(4,12)} is now Processing!`,
                              `Hello ${order.customerInfo.firstName},\n\nGreat news! We have started processing your order and it's getting ready to ship.\n\nTotal: ${order.total.toLocaleString()} ֏\n\nThank you for choosing Masis Garden!`
                            );
                          } else if (newStatus === 'delivered') {
                            sendConfirmationEmail(
                              customerId,
                              `Order #${order.id.slice(4,12)} Delivered!`,
                              `Hello ${order.customerInfo.firstName},\n\nYour order has been delivered successfully. We hope you love your new plants!\n\nIf you have any questions, feel free to reply to this email.`
                            );
                          }
                        }}
                        style={{
                          background: '#1a2018',
                          color: '#e8eee5',
                          border: '1px solid #3a4f38',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending">Mark as Pending</option>
                        <option value="processing">Mark as Processing</option>
                        <option value="delivered">Mark as Delivered</option>
                        <option value="cancelled">Mark as Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="order-details-layout">
                    
                    {/* Customer Info */}
                    <div style={{ flex: '1' }}>
                      <h4 style={{ color: '#c5d8b3', marginBottom: '12px' }}>Customer Details</h4>
                      <div style={{ color: '#e8eee5', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        <strong>Name:</strong> {order.customerInfo.firstName} {order.customerInfo.lastName}<br/>
                        <strong>Phone:</strong> {order.customerInfo.phone}<br/>
                        <strong>Email:</strong> {order.customerInfo.email || 'N/A'}<br/>
                        <strong>City:</strong> {order.customerInfo.city || 'N/A'}<br/>
                        <strong>Address:</strong> {order.customerInfo.address}<br/>
                        {order.customerInfo.note && (
                          <div style={{ marginTop: '8px', padding: '8px', background: '#1a2018', borderRadius: '6px', borderLeft: '3px solid #6ab0ff' }}>
                            <strong>Note:</strong> {order.customerInfo.note}
                          </div>
                        )}
                        {order.customerInfo.isGift && (
                          <div style={{ marginTop: '8px', padding: '8px', background: '#3a1a2a', borderRadius: '6px', borderLeft: '3px solid #ff6b6b' }}>
                            <strong>🎁 GIFT ORDER</strong><br/>
                            Receiver: {order.customerInfo.giftReceiverName}<br/>
                            Message: "{order.customerInfo.giftMessage}"<br/>
                            Hide Price: {order.customerInfo.hidePrice ? 'YES' : 'NO'}
                          </div>
                        )}
                        
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #2a3528' }}>
                          <strong>💳 Payment:</strong> {order.paymentMethod === 'online' ? 'Online Card' : order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={{ flex: '1.5' }}>
                      <h4 style={{ color: '#c5d8b3', marginBottom: '12px' }}>Items ({order.items.length})</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {order.items.map(item => (
                          <div key={item.cartId} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#1a2018', padding: '8px 12px', borderRadius: '8px' }}>
                            {item.images?.[0] && (
                              <img src={item.images[0]} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ color: '#e8eee5', fontWeight: 'bold' }}>{item.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#9aaa90' }}>
                                {item.selectedSize && `Size: ${item.selectedSize} `}
                                {item.selectedColor && `Color: ${item.selectedColor}`}
                              </div>
                            </div>
                            <div style={{ color: '#c5d8b3', fontWeight: 'bold' }}>{item.price.toLocaleString()} ֏</div>
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #2a3528' }}>
                        <div style={{ textAlign: 'right' }}>
                          {order.discountApplied && (
                            <div style={{ fontSize: '0.9rem', color: '#8fbc6a', marginBottom: '4px' }}>
                              Discount ({order.discountApplied.code}): -{order.discountApplied.amount.toLocaleString()} ֏
                            </div>
                          )}
                          <span style={{ fontSize: '1.1rem', color: '#e8eee5' }}>Total: <strong style={{ color: '#c5d8b3', fontSize: '1.3rem' }}>{order.total.toLocaleString()} ֏</strong></span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
