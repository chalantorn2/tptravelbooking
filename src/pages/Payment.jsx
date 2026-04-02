import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Search,
  CreditCard,
  Camera,
  Car,
  CalendarDays,
  Loader2,
  CircleCheck,
  CircleX,
  Eye,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  User,
} from "lucide-react";
import {
  updateTourBooking,
  updateTransferBooking,
} from "../services/bookingService";
import {
  fetchAllTourBookingsInRange,
  fetchAllTransferBookingsInRange,
} from "../services/paymentService";
import BookingDetailModal from "../components/booking/BookingDetailModal";
import { notify } from "../components/ui/Notification";

const Payment = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggling payment
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tours, transfers] = await Promise.all([
        fetchAllTourBookingsInRange(startDate || null, endDate || null),
        fetchAllTransferBookingsInRange(startDate || null, endDate || null),
      ]);

      const combined = [
        ...tours.map((t) => ({ ...t, _type: "tour", _date: t.tour_date })),
        ...transfers.map((t) => ({
          ...t,
          _type: "transfer",
          _date: t.transfer_date,
        })),
      ].sort((a, b) => {
        const dateA = a._date ? new Date(a._date) : new Date(0);
        const dateB = b._date ? new Date(b._date) : new Date(0);
        return dateB - dateA;
      });

      setItems(combined);
    } catch {
      notify.error("Failed to load payment data");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePaymentStatus = async (item) => {
    const key = `${item._type}-${item.id}`;
    setTogglingId(key);
    try {
      const newStatus = item.payment_status === "paid" ? "not_paid" : "paid";
      const newDate =
        newStatus === "paid" ? format(new Date(), "yyyy-MM-dd") : null;

      const updateFn =
        item._type === "tour" ? updateTourBooking : updateTransferBooking;
      const { success, error } = await updateFn(item.id, {
        ...item,
        payment_status: newStatus,
        payment_date: newDate,
      });

      if (!success) throw new Error(error);

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id && i._type === item._type
            ? { ...i, payment_status: newStatus, payment_date: newDate }
            : i,
        ),
      );
      notify.success(
        newStatus === "paid" ? "Marked as paid" : "Marked as not paid",
      );
    } catch (err) {
      notify.error(`Error: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setSelectedType(item._type);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleRefresh = () => {
    loadData();
  };

  // Filtering
  const filtered = items.filter((item) => {
    if (statusFilter === "paid" && item.payment_status !== "paid") return false;
    if (statusFilter === "not_paid" && item.payment_status === "paid")
      return false;
    if (typeFilter !== "all" && item._type !== typeFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (item.reference_id && item.reference_id.toLowerCase().includes(term)) ||
        `${item.first_name || ""} ${item.last_name || ""}`
          .toLowerCase()
          .includes(term) ||
        (item.agent_name && item.agent_name.toLowerCase().includes(term)) ||
        (item._type === "tour" &&
          item.tour_type &&
          item.tour_type.toLowerCase().includes(term)) ||
        (item._type === "transfer" &&
          item.transfer_type &&
          item.transfer_type.toLowerCase().includes(term))
      );
    }
    return true;
  });

  // Summary
  const paidCount = items.filter((i) => i.payment_status === "paid").length;
  const notPaidCount = items.filter((i) => i.payment_status !== "paid").length;
  const tourCount = items.filter((i) => i._type === "tour").length;
  const transferCount = items.filter((i) => i._type === "transfer").length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Manage payment status for tours and transfers
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 shadow-sm"
              placeholder="Search by customer, agent, reference ID, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <CalendarDays
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 shadow-sm text-gray-600"
              />
            </div>
            <span className="text-gray-400 text-sm">-</span>
            <div className="relative">
              <CalendarDays
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 shadow-sm text-gray-600"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-3 py-3 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {/* Payment Status Filter */}
          <div className="flex bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {[
              { key: "all", label: "All" },
              { key: "paid", label: "Paid" },
              { key: "not_paid", label: "Not Paid" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setStatusFilter(opt.key)}
                className={`px-4 py-2 text-xs font-medium transition-colors ${
                  statusFilter === opt.key
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {[
              { key: "all", label: "All", icon: null },
              { key: "tour", label: `Tour (${tourCount})`, icon: Camera },
              {
                key: "transfer",
                label: `Transfer (${transferCount})`,
                icon: Car,
              },
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.key}
                  onClick={() => setTypeFilter(opt.key)}
                  className={`px-4 py-2 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    typeFilter === opt.key
                      ? "bg-blue-600 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {Icon && <Icon size={13} />}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment List */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">Type</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-2">Agent</div>
            <div className="col-span-2">Detail</div>
            <div className="col-span-1">Send To</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-2">Payment</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          {/* Items */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-gray-300" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <CreditCard size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No payment items found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const isTour = item._type === "tour";
                const customerName =
                  `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
                  "No name";
                const isPaid = item.payment_status === "paid";
                const itemKey = `${item._type}-${item.id}`;
                const isToggling = togglingId === itemKey;
                const detail = isTour
                  ? item.tour_type || item.tour_detail || "-"
                  : item.transfer_type || "-";
                const subDetail = isTour
                  ? item.tour_detail && item.tour_type
                    ? item.tour_detail
                    : null
                  : item.pickup_location && item.drop_location
                    ? `${item.pickup_location} → ${item.drop_location}`
                    : null;

                return (
                  <div
                    key={itemKey}
                    className={`px-5 py-3.5 hover:bg-gray-50/50 transition-colors ${
                      isPaid ? "" : "bg-red-50/30"
                    }`}
                  >
                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-12 gap-3 items-center">
                      {/* Type Badge */}
                      <div className="col-span-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            isTour
                              ? "bg-orange-100 text-orange-700"
                              : "bg-teal-100 text-teal-700"
                          }`}
                        >
                          {isTour ? <Camera size={11} /> : <Car size={11} />}
                          {isTour ? "Tour" : "TF"}
                        </span>
                      </div>

                      {/* Customer */}
                      <div className="col-span-2 min-w-0">
                        <div className="font-medium text-sm text-gray-800 truncate">
                          {customerName}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          {item.reference_id || `#${item.id}`}
                        </div>
                      </div>

                      {/* Agent */}
                      <div className="col-span-2 min-w-0">
                        <span className="text-sm text-gray-600 truncate block">
                          {item.agent_name || "-"}
                        </span>
                      </div>

                      {/* Detail */}
                      <div className="col-span-2 min-w-0">
                        <div className="text-sm text-gray-700 truncate">
                          {detail}
                        </div>
                        {subDetail && (
                          <div className="text-[11px] text-gray-400 truncate">
                            {subDetail}
                          </div>
                        )}
                      </div>

                      {/* Send To */}
                      <div className="col-span-1 min-w-0">
                        <span className="text-xs text-gray-600 truncate block">
                          {item.send_to || "-"}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="col-span-1">
                        <span className="text-xs text-gray-500">
                          {item._date || "-"}
                        </span>
                      </div>

                      {/* Payment Status */}
                      <div className="col-span-2">
                        <button
                          onClick={() => togglePaymentStatus(item)}
                          disabled={isToggling}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          } ${isToggling ? "opacity-50" : "cursor-pointer"}`}
                        >
                          {isToggling ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : isPaid ? (
                            <CheckCircle2 size={13} />
                          ) : (
                            <XCircle size={13} />
                          )}
                          {isPaid ? "Paid" : "Not Paid"}
                        </button>
                        {isPaid && item.payment_date && (
                          <div className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                            <Clock size={10} />
                            {item.payment_date}
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <div className="col-span-1 text-center">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isTour
                                ? "bg-orange-100 text-orange-700"
                                : "bg-teal-100 text-teal-700"
                            }`}
                          >
                            {isTour ? "Tour" : "Transfer"}
                          </span>
                          <span className="font-medium text-sm text-gray-800">
                            {customerName}
                          </span>
                        </div>
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="p-1.5 text-gray-400 hover:text-blue-600"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {item.agent_name && (
                          <span className="flex items-center gap-1">
                            <Building2 size={12} />
                            {item.agent_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <CalendarDays size={12} />
                          {item._date || "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 truncate max-w-[60%]">
                          {detail}
                        </span>
                        <button
                          onClick={() => togglePaymentStatus(item)}
                          disabled={isToggling}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          } ${isToggling ? "opacity-50" : ""}`}
                        >
                          {isToggling ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : isPaid ? (
                            <CheckCircle2 size={11} />
                          ) : (
                            <XCircle size={11} />
                          )}
                          {isPaid ? "Paid" : "Not Paid"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <BookingDetailModal
          booking={selectedItem}
          bookingType={selectedType}
          onClose={handleModalClose}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default Payment;
