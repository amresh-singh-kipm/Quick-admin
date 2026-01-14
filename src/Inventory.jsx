import React, { useState, useEffect } from "react";
import {
  RefreshCcw,
  Plus,
  Loader2,
  Edit,
  Package,
  Store,
  X,
  AlertTriangle,
  Trash,
} from "lucide-react";
import api from "./api";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    shop_id: "",
    product_id: "",
    price: "",
    stock_quantity: "",
  });
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, shopRes, prodRes] = await Promise.all([
        api.get("/admin/inventory"),
        api.get("/admin/shops"),
        api.get("/admin/products"),
      ]);
      setInventory(invRes.data.inventory);
      setShops(shopRes.data.shops);
      setProducts(prodRes.data.products);
    } catch (err) {
      console.error("Failed to fetch inventory data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/admin/inventory", formData);
      setFormData({
        shop_id: "",
        product_id: "",
        price: "",
        stock_quantity: "",
      });
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update inventory");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (shopId, productId) => {
    if (!window.confirm("Remove this stock record?")) return;
    try {
      // In backend we handle null shop_id via query params if needed,
      // but for simplicity we use the same endpoint
      const url = shopId
        ? `/admin/inventory?shop_id=${shopId}&product_id=${productId}`
        : `/admin/inventory?product_id=${productId}`;
      await api.delete(url);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-[#1e1e1e] rounded-3xl border border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Inventory Control</h2>
            <p className="text-gray-400 text-sm">
              Manage stock levels (Global or Shop-specific)
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={fetchData}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => {
                setFormData({
                  shop_id: "",
                  product_id: "",
                  price: "",
                  stock_quantity: "",
                });
                setShowAddModal(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all active:scale-95"
            >
              <Plus size={18} />
              <span>Update Stock</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest font-black">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Shop / Scope</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-emerald-500"
                      size={32}
                    />
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-gray-500">
                    No inventory found.
                  </td>
                </tr>
              ) : (
                inventory.map((item, index) => (
                  <tr
                    key={`${item.product_id}-${
                      item.shop_id || "global"
                    }-${index}`}
                    className="hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Package size={16} />
                          </div>
                        )}
                        <span className="text-white font-medium">
                          {item.product_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.shop_name ? (
                        <div className="flex items-center space-x-2 text-gray-400 text-sm font-medium">
                          <Store size={14} className="text-emerald-500" />
                          <span>{item.shop_name}</span>
                        </div>
                      ) : (
                        <span className="text-emerald-500/60 text-[10px] font-black uppercase border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          Independent / Global
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-white font-bold">
                      {item.price !== null ? `₹${item.price}` : "--"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-lg font-black ${
                            item.stock_quantity === null ||
                            item.stock_quantity < 10
                              ? "text-rose-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {item.stock_quantity !== null
                            ? item.stock_quantity
                            : "0"}
                        </span>
                        {(item.stock_quantity === null ||
                          item.stock_quantity < 10) && (
                          <AlertTriangle size={14} className="text-rose-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setFormData({
                              product_id: item.product_id,
                              shop_id: item.shop_id || "",
                              price: item.price || "",
                              stock_quantity: item.stock_quantity || "",
                            });
                            setShowAddModal(true);
                          }}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"
                        >
                          <Edit size={16} />
                        </button>
                        {item.inventory_id && (
                          <button
                            onClick={() =>
                              handleDelete(item.shop_id, item.product_id)
                            }
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#1e1e1e] w-full max-w-md rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-xl font-black text-white">Update Stock</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateStock} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                    Shop (Optional)
                  </label>
                  <select
                    value={formData.shop_id}
                    onChange={(e) =>
                      setFormData({ ...formData, shop_id: e.target.value })
                    }
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">- Independent -</option>
                    {shops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                    Product
                  </label>
                  <select
                    value={formData.product_id}
                    onChange={(e) =>
                      setFormData({ ...formData, product_id: e.target.value })
                    }
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:outline-none focus:border-emerald-500"
                    required
                  >
                    <option value="">- Select -</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Unit Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stock_quantity: e.target.value })
                  }
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 font-bold text-gray-400 hover:bg-gray-800 rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-emerald-500 text-black font-black py-3 rounded-2xl flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Save Changes"
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

export default InventoryManagement;
