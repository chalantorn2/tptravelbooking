import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Eye,
  EyeOff,
  Search,
  UserCog,
  Shield,
  ShieldCheck,
  Code,
} from "lucide-react";
import { fetchUsers, createUser, updateUser, deleteUser } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";

const ROLES = [
  { value: "user", label: "Staff", icon: UserCog, color: "bg-gray-100 text-gray-600" },
  { value: "admin", label: "Admin", icon: Shield, color: "bg-blue-100 text-blue-600" },
  { value: "dev", label: "Developer", icon: Code, color: "bg-purple-100 text-purple-600" },
];

const getRoleBadge = (role) => {
  const r = ROLES.find((r) => r.value === role) || ROLES[0];
  const Icon = r.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${r.color}`}>
      <Icon size={12} />
      {r.label}
    </span>
  );
};

const initialForm = { username: "", fullname: "", password: "", role: "user" };

const UsersManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchUsers();
    if (result.success) {
      setUsers(result.users);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const openCreate = () => {
    setForm(initialForm);
    setIsEditing(false);
    setEditingId(null);
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEdit = (user) => {
    setForm({ username: user.username, fullname: user.fullname || "", password: "", role: user.role });
    setIsEditing(true);
    setEditingId(user.id);
    setShowPassword(false);
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
      const payload = { id: editingId, username: form.username, fullname: form.fullname, role: form.role };
      if (form.password) payload.password = form.password;
      result = await updateUser(payload);
    } else {
      result = await createUser(form);
    }

    if (result.success) {
      await loadUsers();
      closeModal();
    } else {
      alert(result.error || "Something went wrong");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    const result = await deleteUser(id);
    if (result.success) {
      await loadUsers();
    } else {
      alert(result.error || "Cannot delete user");
    }
    setDeleting(false);
    setDeleteConfirm(null);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage system users and roles</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-md shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
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
              <button onClick={loadUsers} className="mt-3 text-blue-600 text-sm hover:underline">
                Try again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-16">
                        <Users size={32} className="mx-auto mb-2 text-gray-300" />
                        <p className="text-gray-400 text-sm">No users found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const isSelf = String(u.id) === String(currentUser?.id);
                      return (
                        <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                {(u.username || "?")[0].toUpperCase()}
                              </div>
                              <span className="font-medium text-sm text-gray-800">{u.username}</span>
                              {isSelf && (
                                <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-semibold">
                                  YOU
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{u.fullname || "-"}</td>
                          <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEdit(u)}
                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </button>
                              {!isSelf && (
                                <button
                                  onClick={() => setDeleteConfirm(u)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                  title="Delete"
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Total count */}
          {!isLoading && !error && (
            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 text-xs text-gray-400">
              Total: {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/60 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                {isEditing ? <Pencil size={18} /> : <Plus size={18} />}
                {isEditing ? "Edit User" : "Add New User"}
              </h3>
              <button onClick={closeModal} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.fullname}
                  onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password {isEditing && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!isEditing}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder={isEditing ? "Enter new password" : "Enter password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const isSelected = form.role === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setForm({ ...form, role: r.value })}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-xs font-semibold">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

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
                  {isEditing ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-gray-200/60">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Delete User</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">{deleteConfirm.username}</span>?
              This action cannot be undone.
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

export default UsersManagement;
