import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Camera,
  Car,
  Users,
  CalendarDays,
  Clock,
  Loader2,
  MapPin,
  User,
  Eye,
  FileText,
  Building2,
  Plane,
  ArrowRight,
} from "lucide-react";
import {
  fetchAllBookings,
  fetchBookingWithDetails,
} from "../services/bookingService";
import BookingDetailModal from "../components/booking/BookingDetailModal";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [expandedData, setExpandedData] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(null);

  // Modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingType, setBookingType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadBookings();
  }, [startDate, endDate]);

  const loadBookings = async () => {
    setIsLoading(true);
    const { bookings: data } = await fetchAllBookings(
      startDate || null,
      endDate || null,
      null,
    );
    setBookings(data);
    setIsLoading(false);
  };

  const toggleExpand = async (bookingId) => {
    if (expandedId === bookingId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(bookingId);

    if (!expandedData[bookingId]) {
      setLoadingDetails(bookingId);
      const { tours, transfers } = await fetchBookingWithDetails(bookingId);
      setExpandedData((prev) => ({
        ...prev,
        [bookingId]: { tours, transfers },
      }));
      setLoadingDetails(null);
    }
  };

  const handleViewDetails = (item, type) => {
    setSelectedBooking(item);
    setBookingType(type);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleRefresh = async () => {
    await loadBookings();
    // Refresh expanded data
    if (expandedId) {
      const { tours, transfers } = await fetchBookingWithDetails(expandedId);
      setExpandedData((prev) => ({
        ...prev,
        [expandedId]: { tours, transfers },
      }));
    }
  };

  const filtered = bookings.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (b.reference_id && b.reference_id.toLowerCase().includes(term)) ||
      `${b.first_name || ""} ${b.last_name || ""}`
        .toLowerCase()
        .includes(term) ||
      (b.agent_name && b.agent_name.toLowerCase().includes(term))
    );
  });

  const getStatusColor = (status) => {
    const map = {
      pending: "bg-gray-100 text-gray-600",
      booked: "bg-blue-50 text-blue-600",
      in_progress: "bg-yellow-50 text-yellow-600",
      completed: "bg-emerald-50 text-emerald-600",
      cancelled: "bg-red-50 text-red-600",
    };
    return map[status] || map.pending;
  };

  const translateStatus = (status) => {
    const map = {
      pending: "รอดำเนินการ",
      booked: "จองแล้ว",
      in_progress: "กำลังดำเนินการ",
      completed: "เสร็จสิ้น",
      cancelled: "ยกเลิก",
    };
    return map[status] || status;
  };

  const totalTours = bookings.reduce(
    (sum, b) => sum + (parseInt(b.tour_count) || 0),
    0,
  );
  const totalTransfers = bookings.reduce(
    (sum, b) => sum + (parseInt(b.transfer_count) || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Overview of all bookings with tours and transfers
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {bookings.length}
                </div>
                <div className="text-xs font-medium text-gray-400">
                  Total Bookings
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-50">
                <Camera size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {totalTours}
                </div>
                <div className="text-xs font-medium text-gray-400">
                  Total Tours
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50">
                <Car size={20} className="text-teal-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {totalTransfers}
                </div>
                <div className="text-xs font-medium text-gray-400">
                  Total Transfers
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Date Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 shadow-sm"
              placeholder="Search by customer name, agent, or reference ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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

        {/* Booking List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-gray-300" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FileText size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No bookings found</p>
            </div>
          ) : (
            filtered.map((booking) => {
              const isExpanded = expandedId === booking.id;
              const details = expandedData[booking.id];
              const isLoadingThis = loadingDetails === booking.id;
              const tourCount = parseInt(booking.tour_count) || 0;
              const transferCount = parseInt(booking.transfer_count) || 0;
              const customerName =
                `${booking.first_name || ""} ${booking.last_name || ""}`.trim() ||
                "No name";

              const paxParts = [
                booking.pax_adt > 0 && `${booking.pax_adt} ADT`,
                booking.pax_chd > 0 && `${booking.pax_chd} CHD`,
                booking.pax_inf > 0 && `${booking.pax_inf} INF`,
              ].filter(Boolean);

              return (
                <div
                  key={booking.id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${
                    isExpanded
                      ? "border-blue-200 shadow-md"
                      : "border-gray-200/80 hover:shadow-md"
                  }`}
                >
                  {/* Booking Header */}
                  <button
                    onClick={() => toggleExpand(booking.id)}
                    className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Reference ID */}
                    <div className="hidden sm:block">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-mono font-medium">
                        {booking.reference_id || `#${booking.id}`}
                      </span>
                    </div>

                    {/* Customer & Agent */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 truncate">
                          {customerName}
                        </span>
                        <span className="sm:hidden px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-mono">
                          {booking.reference_id || `#${booking.id}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        {booking.agent_name && (
                          <span className="flex items-center gap-1">
                            <Building2 size={12} />
                            {booking.agent_name}
                          </span>
                        )}
                        {paxParts.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Users size={12} />
                            {paxParts.join(", ")}
                          </span>
                        )}
                        {booking.start_date && (
                          <span className="flex items-center gap-1">
                            <CalendarDays size={12} />
                            {booking.start_date}
                            {booking.end_date &&
                              booking.end_date !== booking.start_date &&
                              ` - ${booking.end_date}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tour/Transfer Counts */}
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium">
                        <Camera size={13} />
                        {tourCount}
                      </span>
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-medium">
                        <Car size={13} />
                        {transferCount}
                      </span>
                    </div>

                    {/* Expand Icon */}
                    <div className="text-gray-400">
                      {isExpanded ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/30">
                      {isLoadingThis ? (
                        <div className="flex items-center justify-center py-10">
                          <Loader2
                            size={24}
                            className="animate-spin text-gray-300"
                          />
                        </div>
                      ) : details ? (
                        <div className="p-5 space-y-4">
                          {/* Tours */}
                          {details.tours.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1.5">
                                <Camera size={15} /> Tours (
                                {details.tours.length})
                              </h4>
                              <div className="space-y-2">
                                {details.tours.map((tour) => (
                                  <div
                                    key={tour.id}
                                    onClick={() =>
                                      handleViewDetails(tour, "tour")
                                    }
                                    className="bg-white rounded-xl border border-gray-200/80 p-3.5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-l-orange-500"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-gray-400">
                                          {tour.reference_id}
                                        </span>
                                        <span className="font-medium text-sm text-gray-800">
                                          {tour.tour_type || "Tour"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(tour.status)}`}
                                        >
                                          {translateStatus(tour.status)}
                                        </span>
                                        <Eye
                                          size={14}
                                          className="text-gray-300"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <CalendarDays size={12} />
                                        {tour.tour_date || "-"}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {tour.tour_pickup_time || "-"}
                                      </span>
                                      {tour.tour_hotel && (
                                        <span className="flex items-center gap-1">
                                          <MapPin size={12} />
                                          {tour.tour_hotel}
                                          {tour.tour_room_no &&
                                            ` (${tour.tour_room_no})`}
                                        </span>
                                      )}
                                      {tour.send_to && (
                                        <span className="flex items-center gap-1">
                                          <User size={12} />
                                          {tour.send_to}
                                        </span>
                                      )}
                                    </div>
                                    {tour.tour_detail && (
                                      <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">
                                        {tour.tour_detail}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Transfers */}
                          {details.transfers.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-teal-700 mb-2 flex items-center gap-1.5">
                                <Car size={15} /> Transfers (
                                {details.transfers.length})
                              </h4>
                              <div className="space-y-2">
                                {details.transfers.map((transfer) => (
                                  <div
                                    key={transfer.id}
                                    onClick={() =>
                                      handleViewDetails(transfer, "transfer")
                                    }
                                    className="bg-white rounded-xl border border-gray-200/80 p-3.5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-l-4 border-l-teal-500"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-gray-400">
                                          {transfer.reference_id}
                                        </span>
                                        <span className="font-medium text-sm text-gray-800">
                                          {transfer.transfer_type || "Transfer"}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(transfer.status)}`}
                                        >
                                          {translateStatus(transfer.status)}
                                        </span>
                                        <Eye
                                          size={14}
                                          className="text-gray-300"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                      <span className="flex items-center gap-1">
                                        <CalendarDays size={12} />
                                        {transfer.transfer_date || "-"}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {transfer.transfer_time || "-"}
                                      </span>
                                      {(transfer.pickup_location ||
                                        transfer.drop_location) && (
                                        <span className="flex items-center gap-1">
                                          <MapPin size={12} />
                                          {transfer.pickup_location || "?"}
                                          <ArrowRight size={10} />
                                          {transfer.drop_location || "?"}
                                        </span>
                                      )}
                                      {transfer.transfer_flight && (
                                        <span className="flex items-center gap-1">
                                          <Plane size={12} />
                                          {transfer.transfer_flight}
                                          {transfer.transfer_ftime &&
                                            ` (${transfer.transfer_ftime})`}
                                        </span>
                                      )}
                                      {transfer.send_to && (
                                        <span className="flex items-center gap-1">
                                          <User size={12} />
                                          {transfer.send_to}
                                        </span>
                                      )}
                                    </div>
                                    {transfer.transfer_detail && (
                                      <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">
                                        {transfer.transfer_detail}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Empty state */}
                          {details.tours.length === 0 &&
                            details.transfers.length === 0 && (
                              <div className="text-center py-6 text-gray-400 text-sm">
                                No tours or transfers in this booking
                              </div>
                            )}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          bookingType={bookingType}
          onClose={handleModalClose}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default Bookings;
