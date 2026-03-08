import React, { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Search,
  Info,
  Users,
  Map,
  Car,
  MapPin,
  Send,
  Phone,
  Landmark,
  UserCheck,
  CarFront,
} from "lucide-react";
import {
  fetchInformationByCategory,
  addInformation,
  updateInformation,
  deleteInformation,
} from "../services/informationService";
import { useInformation } from "../contexts/InformationContext";

const CATEGORIES = [
  { value: "agent", label: "Agent", icon: Users, showPhone: true },
  { value: "tour_type", label: "ประเภททัวร์", icon: Map },
  { value: "transfer_type", label: "ประเภทรถรับส่ง", icon: Car },
  { value: "province", label: "จังหวัด", icon: Landmark },
  { value: "place", label: "สถานที่", icon: MapPin },
  {
    value: "tour_recipient",
    label: "ผู้รับทัวร์",
    icon: Send,
    showPhone: true,
  },
  {
    value: "transfer_recipient",
    label: "ผู้รับรถรับส่ง",
    icon: Send,
    showPhone: true,
  },
  {
    value: "driver",
    label: "คนขับ",
    icon: UserCheck,
    showPhone: true,
    nameLabel: "ชื่อคนขับ",
  },
  {
    value: "vehicle",
    label: "ข้อมูลรถ",
    icon: CarFront,
    nameLabel: "ป้ายทะเบียน",
    descLabel: "รุ่นรถ",
  },
];

const initialForm = { value: "", description: "", phone: "" };

const InformationManagement = () => {
  const { refreshInformation } = useInformation();
  const [activeTab, setActiveTab] = useState("agent");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const loadItems = async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchInformationByCategory(activeTab);
    if (!result.error) {
      setItems(result.data);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const activeCategory = CATEGORIES.find((c) => c.value === activeTab);

  const openCreate = () => {
    setForm(initialForm);
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setForm({
      value: item.value || "",
      description: item.description || "",
      phone: item.phone || "",
    });
    setIsEditing(true);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    let result;
    if (isEditing) {
      result = await updateInformation(editingId, {
        value: form.value,
        description: form.description || null,
        phone: form.phone || null,
      });
    } else {
      result = await addInformation({
        category: activeTab,
        value: form.value,
        description: form.description || null,
        phone: form.phone || null,
      });
    }

    if (!result.error) {
      await loadItems();
      await refreshInformation();
      closeModal();
    } else {
      alert(result.error || "Something went wrong");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    const result = await deleteInformation(id);
    if (result.success) {
      await loadItems();
      await refreshInformation();
    } else {
      alert(result.error || "Cannot delete item");
    }
    setDeleting(false);
    setDeleteConfirm(null);
  };

  const filteredItems = items.filter(
    (item) =>
      item.value?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Information</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Manage master data for the system
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={`Search...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Plus size={18} />
              Add {activeCategory?.label}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-1.5">
          <div className="flex gap-1 overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    setActiveTab(cat.value);
                    setSearch("");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={16} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} className="animate-spin text-gray-300" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={loadItems}
                className="mt-3 text-blue-600 text-sm hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {activeCategory?.nameLabel || "Name"}
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {activeCategory?.descLabel || "Description"}
                    </th>
                    {activeCategory?.showPhone && (
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                    )}
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={activeCategory?.showPhone ? 4 : 3}
                        className="text-center py-16"
                      >
                        <Info
                          size={32}
                          className="mx-auto mb-2 text-gray-300"
                        />
                        <p className="text-gray-400 text-sm">
                          No {activeCategory?.label.toLowerCase()} found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium text-sm text-gray-800">
                            {item.value}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.description || "-"}
                        </td>
                        {activeCategory?.showPhone && (
                          <td className="px-6 py-4">
                            {item.phone ? (
                              <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                <Phone size={13} className="text-gray-400" />
                                {item.phone}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(item)}
                              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(item)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Total count */}
          {!isLoading && !error && (
            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-400">
              Total: {filteredItems.length} item
              {filteredItems.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/60 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                {isEditing ? <Pencil size={18} /> : <Plus size={18} />}
                {isEditing
                  ? `Edit ${activeCategory?.label}`
                  : `Add ${activeCategory?.label}`}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {activeCategory?.nameLabel || "Name"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  placeholder={`Enter ${(activeCategory?.nameLabel || activeCategory?.label || "").toLowerCase()}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {activeCategory?.descLabel || "Description"}
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                  placeholder={`Enter ${(activeCategory?.descLabel || "description").toLowerCase()} (optional)`}
                />
              </div>

              {activeCategory?.showPhone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="Enter phone number (optional)"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-md shadow-blue-200 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {isEditing ? "Save Changes" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-gray-200/60">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Delete Item
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {deleteConfirm.value}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium shadow-md shadow-red-200 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationManagement;
