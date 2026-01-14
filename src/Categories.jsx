import React, { useState, useEffect } from "react";
import {
  RefreshCcw,
  Plus,
  Loader2,
  Edit,
  Trash,
  Folder,
  X,
  AlertTriangle,
} from "lucide-react";
import api from "./api";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [currentCat, setCurrentCat] = useState(null);
  const [catName, setCatName] = useState("");
  const [catParent, setCatParent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/categories");
      setCategories(response.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modalMode === "add") {
        await api.post("/admin/categories", {
          name: catName,
          parent_id: catParent || null,
        });
      } else {
        await api.put(`/admin/categories/${currentCat.id}`, {
          name: catName,
          parent_id: catParent || null,
        });
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const openEditModal = (cat) => {
    setModalMode("edit");
    setCurrentCat(cat);
    setCatName(cat.name);
    setCatParent(cat.parent_id || "");
    setShowModal(true);
  };

  const resetForm = () => {
    setCatName("");
    setCatParent("");
    setCurrentCat(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-[#1e1e1e] rounded-3xl border border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Product Categories</h2>
            <p className="text-gray-400 text-sm">
              Organize products into hierarchies
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={fetchCategories}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => {
                setModalMode("add");
                setShowModal(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all active:scale-95"
            >
              <Plus size={18} />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest font-black">
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Parent ID</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-emerald-500 mb-2"
                      size={32}
                    />
                    <p className="text-gray-500 text-sm">
                      Fetching categories...
                    </p>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                          <Folder size={20} />
                        </div>
                        <div>
                          <p className="text-white font-bold">{cat.name}</p>
                          <p className="text-gray-500 text-xs">ID: #{cat.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {cat.parent_id ? `#${cat.parent_id}` : "None"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
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
                {modalMode === "add" ? "Add Category" : "Edit Category"}
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
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                  Name
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                  Parent Category
                </label>
                <select
                  value={catParent}
                  onChange={(e) => setCatParent(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="">None (Top Level)</option>
                  {categories
                    .filter((c) => c.id !== currentCat?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
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
                  className="flex-1 bg-emerald-500 text-black font-black py-3 rounded-2xl flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : modalMode === "add" ? (
                    "Create"
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

export default CategoryManagement;
