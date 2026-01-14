import React, { useState, useEffect } from "react";
import {
  RefreshCcw,
  Plus,
  Loader2,
  Edit,
  Trash,
  Store,
  MapPin,
  X,
} from "lucide-react";
import api from "./api";

const ShopManagement = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentShop, setCurrentShop] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    description: "",
    status: "OPEN",
  });

  const fetchShops = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/shops");
      setShops(response.data.shops);
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
      if (modalMode === "add") {
        await api.post("/admin/shops", formData);
      } else {
        await api.put(`/admin/shops/${currentShop.id}`, formData);
      }
      resetForm();
      fetchShops();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this shop registration?")) return;
    try {
      await api.delete(`/admin/shops/${id}`);
      fetchShops();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const openEditModal = (s) => {
    setModalMode("edit");
    setCurrentShop(s);
    setFormData({
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      description: s.description || "",
      status: s.status,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      latitude: "",
      longitude: "",
      description: "",
      status: "OPEN",
    });
    setCurrentShop(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-[#1e1e1e] rounded-3xl border border-gray-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Market Shops</h2>
            <p className="text-gray-400 text-sm">
              Manage physical fulfillment points
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={fetchShops}
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
              <span>Add Shop</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-widest font-black">
                <th className="px-6 py-4">Shop Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-emerald-500"
                      size={32}
                    />
                  </td>
                </tr>
              ) : (
                shops.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                          <Store size={20} />
                        </div>
                        <div>
                          <p className="text-white font-bold">{s.name}</p>
                          <p className="text-gray-500 text-xs">
                            Lat: {Number(s.latitude).toFixed(4)}, Long:{" "}
                            {Number(s.longitude).toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-black px-2 py-1 rounded-full ${
                          s.status === "OPEN"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
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
                {modalMode === "add" ? "Add Shop" : "Edit Shop"}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-widest">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-3 px-4 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="OPEN">Open</option>
                  <option value="CLOSED">Closed</option>
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

export default ShopManagement;
