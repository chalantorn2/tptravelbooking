import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Camera,
  Car,
  CalendarDays,
  Clock,
  Users,
  Loader2,
  ArrowRightLeft,
  TrendingUp,
  Eye,
  User,
} from "lucide-react";
import BookingCalendar from "../components/booking/BookingCalendar";
import BookingList from "../components/booking/BookingList";
import BookingDetailModal from "../components/booking/BookingDetailModal";
import {
  fetchTourBookingsByDate,
  fetchTransferBookingsByDate,
} from "../services/bookingService";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tourBookings, setTourBookings] = useState([]);
  const [transferBookings, setTransferBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingType, setBookingType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const queryDate = format(selectedDate, "yyyy-MM-dd");
  const formattedDate = format(selectedDate, "dd MMMM yyyy");

  useEffect(() => {
    fetchBookings(queryDate);
  }, [queryDate]);

  const fetchBookings = async (date) => {
    setIsLoading(true);
    setError(null);
    try {
      const [tourRes, transferRes] = await Promise.all([
        fetchTourBookingsByDate(date),
        fetchTransferBookingsByDate(date),
      ]);
      setTourBookings(tourRes.tourBookings || []);
      setTransferBookings(transferRes.transferBookings || []);
    } catch {
      setError("Unable to load booking data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (booking, type) => {
    setSelectedBooking(booking);
    setBookingType(type);
    setIsModalOpen(true);
  };

  const allBookings = [...tourBookings, ...transferBookings];
  const filteredTour =
    filter === "all"
      ? tourBookings
      : tourBookings.filter((b) => b.status === filter);
  const filteredTransfer =
    filter === "all"
      ? transferBookings
      : transferBookings.filter((b) => b.status === filter);

  // Summary counts
  const countByStatus = (status) =>
    allBookings.filter((b) => b.status === status).length;

  const summaryCards = [
    {
      key: "all",
      label: "ทั้งหมด",
      count: allBookings.length,
      icon: CalendarDays,
      color: "from-blue-600 to-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      ring: "ring-blue-200",
    },
    {
      key: "pending",
      label: "รอดำเนินการ",
      count: countByStatus("pending"),
      icon: Clock,
      color: "from-gray-500 to-gray-400",
      bg: "bg-gray-50",
      text: "text-gray-600",
      ring: "ring-gray-200",
    },
    {
      key: "booked",
      label: "จองแล้ว",
      count: countByStatus("booked"),
      icon: Users,
      color: "from-blue-500 to-blue-400",
      bg: "bg-blue-50",
      text: "text-blue-500",
      ring: "ring-blue-200",
    },
    {
      key: "in_progress",
      label: "กำลังดำเนินการ",
      count: countByStatus("in_progress"),
      icon: TrendingUp,
      color: "from-yellow-500 to-amber-400",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      ring: "ring-yellow-200",
    },
    {
      key: "completed",
      label: "เสร็จสิ้น",
      count: countByStatus("completed"),
      icon: ArrowRightLeft,
      color: "from-emerald-500 to-emerald-400",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      ring: "ring-emerald-200",
    },
  ];

  // Combined bookings for "Today's Bookings" panel
  const todayList = [
    ...filteredTour.map((b) => ({ ...b, _type: "tour" })),
    ...filteredTransfer.map((b) => ({ ...b, _type: "transfer" })),
  ];

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

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Booking Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Manage and monitor your bookings
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            <CalendarDays size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            const isActive = filter === card.key;
            return (
              <button
                key={card.key}
                onClick={() => setFilter(card.key)}
                className={`relative p-4 rounded-2xl border transition-all duration-200 text-left group
                  ${
                    isActive
                      ? `bg-gradient-to-br ${card.color} text-white shadow-lg shadow-${card.key === "all" ? "blue" : card.key === "pending" ? "gray" : card.key === "booked" ? "blue" : card.key === "in_progress" ? "yellow" : "emerald"}-200/50 scale-[1.02] ring-2 ring-white/50`
                      : "bg-white border-gray-200/80 hover:shadow-md hover:-translate-y-0.5"
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-xl ${isActive ? "bg-white/20" : card.bg}`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? "text-white" : card.text}
                    />
                  </div>
                  {isLoading && (
                    <Loader2
                      size={14}
                      className={`animate-spin ${isActive ? "text-white/60" : "text-gray-300"}`}
                    />
                  )}
                </div>
                <div
                  className={`text-2xl font-bold ${isActive ? "text-white" : "text-gray-800"}`}
                >
                  {card.count}
                </div>
                <div
                  className={`text-xs font-medium mt-0.5 ${isActive ? "text-white/80" : "text-gray-400"}`}
                >
                  {card.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Calendar + Today's Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Calendar - compact */}
          <div className="lg:col-span-3">
            <BookingCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Today's Bookings - side panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden h-full flex flex-col">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-5 py-3.5 flex justify-between items-center">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <CalendarDays size={16} />
                  Today's Bookings
                </h3>
                <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {todayList.length}
                </span>
              </div>

              <div
                className="flex-1 overflow-y-auto p-3 space-y-2"
                style={{ maxHeight: "420px" }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 size={24} className="animate-spin text-gray-300" />
                  </div>
                ) : error ? (
                  <div className="text-center py-6 text-red-500 text-sm">
                    {error}
                  </div>
                ) : todayList.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    <CalendarDays
                      size={32}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    No bookings for this date
                  </div>
                ) : (
                  todayList.map((booking) => {
                    const isTour = booking._type === "tour";
                    const customerName =
                      `${booking.first_name || ""} ${booking.last_name || ""}`.trim() ||
                      "No name";
                    const time = isTour
                      ? booking.tour_pickup_time
                      : booking.transfer_time;

                    return (
                      <div
                        key={`${booking._type}-${booking.id}`}
                        onClick={() =>
                          handleViewDetails(booking, booking._type)
                        }
                        className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-l-4 ${
                          isTour ? "border-l-orange-500" : "border-l-teal-500"
                        } border-gray-100 bg-white`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isTour
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-teal-100 text-teal-700"
                              }`}
                            >
                              {isTour ? "Tour" : "Transfer"}
                            </span>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                              {customerName}
                            </span>
                          </div>
                          <Eye
                            size={14}
                            className="text-gray-300 group-hover:text-gray-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock size={12} />
                            <span className="font-medium">{time || "-"}</span>
                            <span className="text-gray-300">|</span>
                            <User size={12} />
                            <span>{booking.agent_name || "-"}</span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(booking.status)}`}
                          >
                            {translateStatus(booking.status)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tour & Transfer Detail Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tour */}
          <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-5 py-3 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <Camera size={18} />
                Tour Bookings
              </h3>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-sm font-medium">
                {filteredTour.length}
              </span>
            </div>
            <div className="p-4">
              <BookingList
                bookings={filteredTour}
                type="tour"
                isLoading={isLoading}
                error={error}
                onViewDetails={handleViewDetails}
              />
            </div>
          </div>

          {/* Transfer */}
          <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-5 py-3 flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <Car size={18} />
                Transfer Bookings
              </h3>
              <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-sm font-medium">
                {filteredTransfer.length}
              </span>
            </div>
            <div className="p-4">
              <BookingList
                bookings={filteredTransfer}
                type="transfer"
                isLoading={isLoading}
                error={error}
                onViewDetails={handleViewDetails}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          bookingType={bookingType}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
          }}
          onRefresh={() => fetchBookings(queryDate)}
        />
      )}
    </div>
  );
};

export default Dashboard;
