import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardPlus,
  Calendar,
  Database,
  Users,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileBarChart,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, checkPermission } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    {
      path: "/booking-form",
      label: "Add Booking",
      icon: <ClipboardPlus size={20} />,
    },
    { path: "/bookings", label: "Bookings", icon: <Calendar size={20} /> },
    {
      path: "/payment",
      label: "Payment",
      icon: <CreditCard size={20} />,
    },
    {
      path: "/report",
      label: "Report",
      icon: <FileBarChart size={20} />,
    },
    {
      path: "/information",
      label: "Information",
      icon: <Database size={20} />,
    },
    {
      path: "/users",
      label: "Users",
      icon: <Users size={20} />,
      permission: "admin",
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return checkPermission(item.permission);
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`h-screen p-3 flex-shrink-0 transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[240px]"}`}
    >
      <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-200/60 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-5 pb-3 flex flex-col items-center relative">
          <div
            className={`transition-all duration-300 flex items-center justify-center w-full mb-3 ${collapsed ? "h-10" : "h-auto"}`}
          >
            <img
              src="/logo.png"
              alt="Logo"
              className={`rounded-full object-cover transition-all duration-300 border-2 border-blue-100 shadow-sm ${collapsed ? "w-10 h-10" : "w-20 h-20"}`}
            />
          </div>

          {!collapsed && (
            <div className="text-center mb-1">
              <h1 className="text-lg font-bold text-blue-700 tracking-wide">
                TP Travel
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                Booking System
              </p>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-6 top-10 bg-blue-600 hover:bg-blue-500 text-white p-1 rounded-full shadow-md transition-all duration-200 border-2 border-white z-50"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-gray-100" />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {filteredNavItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "text-gray-500 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <span
                      className={`mr-3 transition-transform duration-200 ${!isActive && "group-hover:scale-110 group-hover:text-blue-600"}`}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span
                        className={`font-medium text-sm tracking-wide ${isActive ? "font-semibold" : ""}`}
                      >
                        {item.label}
                      </span>
                    )}
                    {!collapsed && isActive && (
                      <div className="absolute right-2.5 w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        {user && (
          <div className="p-3 mx-3 mb-2 rounded-xl bg-blue-50/60 border border-blue-100/80">
            <div
              className={`flex items-center ${collapsed ? "justify-center" : ""}`}
            >
              <div className="rounded-full bg-blue-600 p-2 shadow-sm">
                <User size={16} className="text-white" />
              </div>
              {!collapsed && (
                <div className="ml-3 overflow-hidden">
                  <div className="font-semibold text-sm text-gray-700 truncate">
                    {user.fullname}
                  </div>
                  <div className="text-xs text-blue-500 font-medium uppercase tracking-wider">
                    {user.role === "dev"
                      ? "Developer"
                      : user.role === "admin"
                        ? "Admin"
                        : "Staff"}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut
              size={20}
              className={`transition-transform duration-200 ${!collapsed && "mr-3 group-hover:-translate-x-1"}`}
            />
            {!collapsed && (
              <span className="font-medium text-sm">Sign Out</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
