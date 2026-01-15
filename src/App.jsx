import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Store,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  TrendingUp,
  CreditCard,
  Truck,
  RefreshCcw,
  Layers,
  Edit,
  Trash,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
} from "lucide-react";
import api from "./api";
import Login from "./Login";
import ProductManagement from "./Products";
import ShopManagement from "./Shops";
import CategoryManagement from "./Categories";
import InventoryManagement from "./Inventory";
import OrderManagement from "./Orders";
// --- COMPONENTS ---

const SidebarItem = ({ icon: Icon, label, href, active }) => (
  <Link
    to={href}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active
        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-gray-800 hover:border-emerald-500/50 transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-500/10`}>
        <Icon className={`text-${color}-500`} size={24} />
      </div>
      <span
        className={`text-xs font-bold px-2 py-1 rounded-full ${
          change.startsWith("+")
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-rose-500/10 text-rose-500"
        }`}
      >
        {change}
      </span>
    </div>
    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    itemRevenue: 0,
    deliveryRevenue: 0,
    handlingRevenue: 0,
    totalOrders: 0,
    deliveredOrders: 0,
    incompleteOrders: 0,
    recentOrders: [],
    statusBreakdown: [],
  });
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchShops = async () => {
    try {
      const response = await api.get("/admin/shops");
      setShops(response.data.shops);
    } catch (err) {
      console.error("Failed to fetch shops", err);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        shopId: shopId || undefined,
      };
      const response = await api.get("/admin/dashboard-stats", { params });
      setStats(response.data.stats);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRange = (days) => {
    const end = new Date().toISOString().split("T")[0];
    const start = new Date(new Date().setDate(new Date().getDate() - days))
      .toISOString()
      .split("T")[0];
    setStartDate(start);
    setEndDate(end);
  };

  const handleAllTime = () => {
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    fetchStats();
  }, [startDate, endDate, shopId]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Controls */}
      <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-gray-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Dashboard Analytics
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Dynamic performance overview & filtering
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Quick Ranges */}
            <div className="flex bg-gray-900/50 p-1 rounded-2xl border border-gray-800">
              {[
                { label: "7D", val: 7 },
                { label: "30D", val: 30 },
                { label: "90D", val: 90 },
              ].map((r) => (
                <button
                  key={r.label}
                  onClick={() => handleQuickRange(r.val)}
                  className="px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-gray-500 hover:text-white transition-colors"
                >
                  {r.label}
                </button>
              ))}
              <button
                onClick={handleAllTime}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                  !startDate && !endDate
                    ? "bg-emerald-500 text-black shadow-lg"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                All Time
              </button>
            </div>

            {/* Shop Filter */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-emerald-500 transition-colors">
                <MapPin size={16} />
              </div>
              <select
                value={shopId}
                onChange={(e) => setShopId(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-2xl pl-11 pr-10 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer min-w-[180px]"
              >
                <option value="">All Shops</option>
                {shops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <Layers size={14} />
              </div>
            </div>

            {/* Date Inputs */}
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-2xl p-1 px-3">
              <div className="flex flex-col">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-white outline-none cursor-pointer"
                />
              </div>
              <span className="text-gray-700 font-bold px-1">/</span>
              <div className="flex flex-col">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-[11px] font-bold text-white outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${Number(stats.totalRevenue).toLocaleString()}`}
          change="Total"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Item Revenue"
          value={`₹${Number(stats.itemRevenue).toLocaleString()}`}
          change="Products"
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Delivery Revenue"
          value={`₹${Number(stats.deliveryRevenue).toLocaleString()}`}
          change="Shipping"
          icon={Truck}
          color="purple"
        />
        <StatCard
          title="Other Charges"
          value={`₹${Number(stats.handlingRevenue).toLocaleString()}`}
          change="Handling"
          icon={CreditCard}
          color="amber"
        />
      </div>

      {/* Order Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change="Volume"
          icon={ShoppingBag}
          color="emerald"
        />
        <StatCard
          title="Delivered Orders"
          value={stats.deliveredOrders}
          change="Finalized"
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Incomplete Orders"
          value={stats.incompleteOrders}
          change="In progress"
          icon={RefreshCcw}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Breakdown */}
        <div className="lg:col-span-1 bg-[#1e1e1e] p-6 rounded-3xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">
              Status Distribution
            </h3>
            <Layers className="text-emerald-500" size={20} />
          </div>
          <div className="space-y-4">
            {stats.statusBreakdown.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-900/50 border border-gray-800 group hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      item.status === "DELIVERED"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : item.status === "CANCELLED"
                        ? "bg-rose-500/10 text-rose-500"
                        : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {item.status === "DELIVERED" ? (
                      <CheckCircle size={14} />
                    ) : item.status === "CANCELLED" ? (
                      <AlertCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                    {item.status}
                  </span>
                </div>
                <span className="text-white font-black text-lg">
                  {item.count}
                </span>
              </div>
            ))}
            {stats.statusBreakdown.length === 0 && (
              <p className="text-gray-500 text-center py-10 italic text-sm">
                No data for this period
              </p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-[#1e1e1e] p-6 rounded-3xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Latest Activity</h3>
            <Link
              to="/orders"
              className="text-emerald-500 text-xs font-black uppercase tracking-widest hover:text-emerald-400"
            >
              View All Orders
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-500 uppercase tracking-tighter border-b border-gray-800">
                  <th className="pb-4 pr-4">Order ID</th>
                  <th className="pb-4 pr-4">Customer</th>
                  <th className="pb-4 pr-4">Amount</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="group cursor-default">
                    <td className="py-4 pr-4">
                      <span className="text-white font-mono text-xs font-bold bg-gray-900 px-2 py-1 rounded-lg border border-gray-800">
                        #{order.id}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <p className="text-gray-300 text-sm font-bold truncate max-w-[120px]">
                        {order.customer_name}
                      </p>
                    </td>
                    <td className="py-4 pr-4 text-white font-bold text-sm">
                      ₹{order.total_amount}
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-[9px] font-black px-2 py-1 rounded-xl uppercase tracking-tighter shadow-sm ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-500 text-black"
                            : order.status === "CANCELLED"
                            ? "bg-rose-500 text-white"
                            : "bg-gray-800 text-gray-300 border border-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-10 text-center text-gray-500 italic text-sm"
                    >
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit Form State
  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    role: "",
    is_active: 1,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data.users);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/admin/users/${currentUser.id}`, formData);
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this user?")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  const openEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      full_name: user.full_name,
      mobile_number: user.mobile_number,
      role: user.role,
      is_active: user.is_active || 1,
    });
    setShowModal(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-[#1e1e1e] rounded-3xl border border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Platform Users</h2>
            <p className="text-gray-400 text-sm">
              Manage accounts and system access
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all active:scale-95"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest font-black">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-800/30 transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-white">
                    {u.full_name}
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-medium">
                    {u.mobile_number}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-black ${
                        u.role === "ADMIN"
                          ? "bg-purple-500/10 text-purple-500"
                          : "bg-emerald-500/10 text-emerald-500"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeactivate(u.id)}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] w-full max-w-md rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-xl font-black text-white">Edit User</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.mobile_number}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile_number: e.target.value })
                  }
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  required
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SHOP_OWNER">SHOP_OWNER</option>
                  <option value="DELIVERY_PARTNER">DELIVERY_PARTNER</option>
                </select>
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-800 rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-emerald-500 text-black font-black py-3 rounded-2xl flex items-center justify-center"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Update User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const MainLayout = ({ children, handleLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return "Dashboard Summary";
    return path.charAt(0).toUpperCase() + path.slice(1) + " Management";
  };

  return (
    <div className="flex h-screen bg-[#0b0c0e] text-white selection:bg-emerald-500 selection:text-black font-['Inter']">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1e1e1e] border-r border-gray-800 transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center space-x-3 mb-10 px-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <ShoppingBag className="text-black" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">
              QUICK<span className="text-emerald-500">PRO</span>
            </span>
          </div>
          <nav className="flex-1 space-y-2">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-4 mb-2">
              Main
            </div>
            <SidebarItem
              icon={LayoutDashboard}
              label="Dashboard"
              href="/"
              active={location.pathname === "/"}
            />
            <SidebarItem
              icon={Users}
              label="Users"
              href="/users"
              active={location.pathname === "/users"}
            />

            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-4 mt-6 mb-2">
              Catalog
            </div>
            <SidebarItem
              icon={Layers}
              label="Categories"
              href="/categories"
              active={location.pathname === "/categories"}
            />
            <SidebarItem
              icon={Package}
              label="Core Products"
              href="/products"
              active={location.pathname === "/products"}
            />

            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-4 mt-6 mb-2">
              Fulfillment
            </div>
            <SidebarItem
              icon={Store}
              label="Shops"
              href="/shops"
              active={location.pathname === "/shops"}
            />
            <SidebarItem
              icon={RefreshCcw}
              label="Inventory"
              href="/inventory"
              active={location.pathname === "/inventory"}
            />
            <SidebarItem
              icon={ShoppingBag}
              label="Orders"
              href="/orders"
              active={location.pathname === "/orders"}
            />
          </nav>
          <div className="mt-auto pt-6 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all w-full text-left font-bold"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent">
        <header className="h-20 bg-[#0b0c0e]/40 backdrop-blur-2xl border-b border-gray-800/50 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-black tracking-tight">
              {getPageTitle()}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-3 py-1.5 rounded-2xl bg-gray-900 border border-gray-800 shadow-inner">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-black text-sm uppercase">
                {user.name ? user.name.charAt(0) : "A"}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-black text-white leading-none mb-0.5">
                  {user.name || "Admin"}
                </p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                  {user.role || "Super Admin"}
                </p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setToken(null);
  };

  if (!token) return <Login setToken={setToken} />;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout handleLogout={handleLogout}>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/users"
          element={
            <MainLayout handleLogout={handleLogout}>
              <UserManagement />
            </MainLayout>
          }
        />
        <Route
          path="/categories"
          element={
            <MainLayout handleLogout={handleLogout}>
              <CategoryManagement />
            </MainLayout>
          }
        />
        <Route
          path="/products"
          element={
            <MainLayout handleLogout={handleLogout}>
              <ProductManagement />
            </MainLayout>
          }
        />
        <Route
          path="/shops"
          element={
            <MainLayout handleLogout={handleLogout}>
              <ShopManagement />
            </MainLayout>
          }
        />
        <Route
          path="/inventory"
          element={
            <MainLayout handleLogout={handleLogout}>
              <InventoryManagement />
            </MainLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <MainLayout handleLogout={handleLogout}>
              <OrderManagement />
            </MainLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
