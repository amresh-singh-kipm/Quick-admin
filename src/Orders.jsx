import React, { useState, useEffect } from "react";
import {
  RefreshCcw,
  Loader2,
  ShoppingBag,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  Package,
  Truck,
  CreditCard,
} from "lucide-react";
import api from "./api";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/orders");
      setOrders(response.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      // Update selected order in modal too
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/10 text-amber-500";
      case "CONFIRMED":
        return "bg-blue-500/10 text-blue-500";
      case "PACKED":
        return "bg-purple-500/10 text-purple-500";
      case "SHIPPED":
        return "bg-indigo-500/10 text-indigo-500";
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-500";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock size={14} />;
      case "CONFIRMED":
        return <CheckCircle size={14} />;
      case "PACKED":
        return <Package size={14} />;
      case "SHIPPED":
        return <Truck size={14} />;
      case "DELIVERED":
        return <CheckCircle size={14} />;
      case "CANCELLED":
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-[#1e1e1e] rounded-3xl border border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Customer Orders</h2>
            <p className="text-gray-400 text-sm">
              Monitor and manage real-time orders
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest font-black">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-emerald-500"
                      size={32}
                    />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-emerald-500 font-mono text-sm leading-none">
                        #{order.id}
                      </span>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">
                            {order.customer_name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {order.mobile_number}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-400 text-sm">
                        {order.items?.length || 0} items
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded"
                          >
                            {item.name}
                          </span>
                        ))}
                        {order.items?.length > 2 && (
                          <span className="text-[10px] text-gray-500">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-black text-white">
                      ₹{parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1e1e1e] w-full max-w-2xl rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-800 bg-gray-900/50 flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 bg-emerald-500 text-black text-[10px] font-black rounded-full uppercase tracking-widest">
                    Order #{selectedOrder.id}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">
                  Order Summary
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-2xl transition-all"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Customer Info
                  </h4>
                  <div className="flex items-center space-x-3 text-white">
                    <User className="text-emerald-500" size={18} />
                    <span className="font-bold">
                      {selectedOrder.customer_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-400">
                    <Clock size={18} />
                    <span className="text-sm">
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Delivery To
                  </h4>
                  <div className="flex items-start space-x-3 text-gray-300">
                    <MapPin
                      className="text-rose-500 mt-0.5 shrink-0"
                      size={18}
                    />
                    <span className="text-sm leading-relaxed">
                      {/* {JSON.parse(selectedOrder?.address_snapshot || "{}") */}
                      {selectedOrder?.address_snapshot?.address ||
                        "Standard Delivery Address"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment & Delivery Info */}
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Payment Method
                  </h4>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="text-emerald-500" size={16} />
                    <span className="text-white font-bold text-sm">
                      {selectedOrder.payment_method || 'POD'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Delivery Type
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Truck className="text-blue-500" size={16} />
                    <span className="text-white font-bold text-sm">
                      {selectedOrder.delivery_type || 'INSTANT'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    Payment Status
                  </h4>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-purple-500" size={16} />
                    <span className="text-white font-bold text-sm">
                      {selectedOrder.payment_status || 'COMPLETED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Items Ordered
                </h4>
                <div className="bg-gray-900/50 rounded-3xl border border-gray-800 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-gray-500 uppercase font-black tracking-widest border-b border-gray-800">
                        <th className="px-6 py-4">Item</th>
                        <th className="px-4 py-4 text-center">Qty</th>
                        <th className="px-6 py-4 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {selectedOrder.items?.map((item) => (
                        <tr key={item.id} className="text-sm">
                          <td className="px-6 py-4 text-white font-bold">
                            {item.name}
                          </td>
                          <td className="px-4 py-4 text-center text-gray-400">
                            x{item.quantity}
                          </td>
                          <td className="px-6 py-4 text-right text-emerald-500 font-black">
                            ₹{parseFloat(item.price_snapshot).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-emerald-500/5">
                        <td
                          colSpan="2"
                          className="px-6 py-5 text-gray-300 font-black uppercase text-xs tracking-widest"
                        >
                          Grand Total
                        </td>
                        <td className="px-6 py-5 text-right text-white font-black text-lg font-mono">
                          ₹{parseFloat(selectedOrder.total_amount).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            <div className="p-8 border-t border-gray-800 bg-gray-900/50 flex space-x-4 items-center">
              <div className="flex-1">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                  Update Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateStatus(selectedOrder.id, e.target.value)
                  }
                  className="w-full bg-[#1e1e1e] border border-gray-800 rounded-2xl py-3 px-4 text-sm font-bold text-white focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 py-3.5 px-6 bg-emerald-500 text-black font-black rounded-2xl hover:bg-emerald-400 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
