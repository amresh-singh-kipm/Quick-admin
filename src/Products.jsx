import React, { useState, useEffect } from "react";
import {
  RefreshCcw,
  Plus,
  Loader2,
  Edit,
  Trash,
  Package,
  X,
  Copy,
} from "lucide-react";
import api from "./api";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    size_quantity: "",
    size_unit: "g",
    image_url: "",
    brand: "",
    mrp: "",
    actual_price: "",
    stock_quantity: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/admin/products"),
        api.get("/admin/categories"),
      ]);
      setProducts(prodRes.data.products);
      setCategories(catRes.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Combine size_quantity and size_unit into size
      const size = formData.size_quantity ? `${formData.size_quantity}${formData.size_unit}` : null;
      const submitData = {
        ...formData,
        size,
        size_quantity: undefined,
        size_unit: undefined,
      };
      
      if (modalMode === "add") {
        await api.post("/admin/products", submitData);
      } else {
        await api.put(`/admin/products/${currentProduct.id}`, submitData);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const openEditModal = (p) => {
    setModalMode("edit");
    setCurrentProduct(p);
    setFormData({
      name: p.name,
      category_id: p.category_id,
      description: p.description || "",
      size_quantity: p.size ? p.size.match(/^(\d+\.?\d*)/)?.[1] || "" : "",
      size_unit: p.size ? p.size.match(/(kg|g|L|ml|pieces?)$/i)?.[0] || "g" : "g",
      image_url: p.image_url || "",
      brand: p.brand || "",
      mrp: p.mrp || "",
      actual_price: p.actual_price || "",
    });
    setShowModal(true);
  };

  // Clone product function
  const handleCloneProduct = (p) => {
    setCurrentProduct(null); // Set to null so it creates a new product
    setFormData({
      name: `${p.name} (Copy)`,
      category_id: p.category_id,
      description: p.description || "",
      size_quantity: p.size ? p.size.match(/^(\d+\.?\d*)/)?.[1] || "" : "",
      size_unit: p.size ? p.size.match(/(kg|g|L|ml|pieces?)$/i)?.[0] || "g" : "g",
      image_url: p.image_url || "",
      brand: p.brand || "",
      mrp: p.mrp || "",
      actual_price: p.actual_price || "",
      stock_quantity: "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: "", category_id: "", description: "", size_quantity: "", size_unit: "g", image_url: "", brand: "", mrp: "", actual_price: "", stock_quantity: "" });
    setCurrentProduct(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-[#1e1e1e] rounded-3xl border border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              Global Product Catalog
            </h2>
            <p className="text-gray-400 text-sm">Manage core product data</p>
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
                setModalMode("add");
                setShowModal(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest font-black">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Pricing</th>
                <th className="px-6 py-4 text-right">Actions</th>
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
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Package size={20} />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-bold">{p.name}</p>
                          <p className="text-gray-500 text-xs">
                            UUID: {p.uuid?.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300 text-sm">{p.brand || "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-500">
                        {p.category_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.mrp || p.actual_price ? (
                        <div className="text-sm">
                          {p.mrp && (
                            <p className="text-gray-500 line-through">₹{parseFloat(p.mrp).toFixed(2)}</p>
                          )}
                          {p.actual_price && (
                            <p className="text-emerald-400 font-bold">₹{parseFloat(p.actual_price).toFixed(2)}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">-</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleCloneProduct(p)}
                          className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"
                          title="Clone Product"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] w-full max-w-md rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-xl font-black text-white">
                {modalMode === "add" ? "Register Product" : "Edit Product"}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  placeholder="e.g., Nestle, Amul, Britannia"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Product Size/Weight
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.size_quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, size_quantity: e.target.value })
                    }
                    placeholder="Quantity"
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <select
                    value={formData.size_unit}
                    onChange={(e) =>
                      setFormData({ ...formData, size_unit: e.target.value })
                    }
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="g">g (grams)</option>
                    <option value="kg">kg (kilograms)</option>
                    <option value="ml">ml (milliliters)</option>
                    <option value="L">L (liters)</option>
                    <option value="piece">piece</option>
                    <option value="pieces">pieces</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.mrp}
                    onChange={(e) =>
                      setFormData({ ...formData, mrp: e.target.value })
                    }
                    placeholder="Maximum Retail Price"
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                    Actual Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.actual_price}
                    onChange={(e) =>
                      setFormData({ ...formData, actual_price: e.target.value })
                    }
                    placeholder="Selling Price"
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Initial Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stock_quantity: e.target.value })
                  }
                  placeholder="Enter initial stock (optional)"
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
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
                  ) : modalMode === "add" ? (
                    "Register"
                  ) : (
                    "Update"
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

export default ProductManagement;
