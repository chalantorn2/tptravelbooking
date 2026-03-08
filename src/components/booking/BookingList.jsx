import React from "react";
import { format } from "date-fns";
import {
  Eye,
  Clock,
  MapPin,
  Plane,
  User,
  Hotel,
  BedDouble,
  FileText,
} from "lucide-react";

const BookingList = ({ bookings, type, isLoading, error, onViewDetails }) => {
  const getStatusColor = (status) => {
    const map = {
      pending: "bg-gray-100 text-gray-600 border-gray-200",
      booked: "bg-blue-50 text-blue-600 border-blue-200",
      in_progress: "bg-yellow-50 text-yellow-600 border-yellow-200",
      completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
      cancelled: "bg-red-50 text-red-600 border-red-200",
    };
    return map[status] || map.pending;
  };

  const translateStatus = (status) => {
    const map = {
      pending: "Pending",
      booked: "Booked",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return map[status] || status;
  };

  const formatPax = (booking) => {
    const adt = parseInt(booking.booking_pax_adt || 0);
    const chd = parseInt(booking.booking_pax_chd || 0);
    const inf = parseInt(booking.booking_pax_inf || 0);
    const parts = [];
    if (adt > 0) parts.push(`${adt}`);
    if (chd > 0) parts.push(`${chd}`);
    if (inf > 0) parts.push(`${inf}`);
    return parts.length > 0 ? parts.join("+") : "0";
  };

  const getLeftBorderColor = () =>
    type === "tour" ? "border-l-cyan-500" : "border-l-teal-500";

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-gray-200 border-t-blue-600" />
        <p className="mt-2 text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center text-sm">
        {error}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-sm">
        No {type === "tour" ? "Tour" : "Transfer"} bookings found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking, index) => {
        const customerName =
          `${booking.first_name || ""} ${booking.last_name || ""}`.trim() ||
          "No name";

        return (
          <div
            key={booking.id}
            className={`bg-white border border-gray-200/80 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-l-4 ${getLeftBorderColor()}`}
          >
            <div className="p-3.5">
              {/* Header row */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <span className="text-gray-400 text-sm">{index + 1}.</span>
                  <User size={16} className="text-gray-400" />
                  <span>{customerName}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-500">
                    {formatPax(booking)} pax
                  </span>
                </div>
                <button
                  onClick={() => onViewDetails(booking, type)}
                  className={`p-1.5 rounded-lg transition-colors ${type === "tour" ? "text-cyan-600 hover:bg-cyan-50" : "text-teal-600 hover:bg-teal-50"}`}
                >
                  <Eye size={16} />
                </button>
              </div>

              {/* Time & Date */}
              <div className="flex flex-wrap gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 text-sm rounded-lg font-medium ${type === "tour" ? "bg-cyan-50 text-cyan-700" : "bg-teal-50 text-teal-700"}`}
                >
                  <Clock size={14} className="mr-1" />
                  {type === "tour"
                    ? booking.tour_pickup_time || "-"
                    : booking.transfer_time || "-"}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 text-xs rounded-lg bg-gray-50 text-gray-600">
                  {type === "tour"
                    ? format(
                        new Date(booking.tour_date + "T00:00:00"),
                        "dd/MM/yyyy",
                      )
                    : format(
                        new Date(booking.transfer_date + "T00:00:00"),
                        "dd/MM/yyyy",
                      )}
                </span>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-600 space-y-1">
                {type === "tour" ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Hotel
                        size={14}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span>
                        <b className="text-gray-400">Hotel:</b>{" "}
                        {booking.tour_hotel || "-"}
                      </span>
                      {booking.tour_room_no && (
                        <>
                          <BedDouble
                            size={14}
                            className="text-gray-400 ml-2 flex-shrink-0"
                          />
                          <span>
                            <b className="text-gray-400">Room:</b>{" "}
                            {booking.tour_room_no}
                          </span>
                        </>
                      )}
                    </div>
                    {booking.tour_detail && (
                      <div className="flex items-start gap-1.5">
                        <FileText
                          size={14}
                          className="text-gray-400 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-gray-500">
                          {booking.tour_detail}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <MapPin
                        size={14}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span>
                        <b className="text-gray-400">From:</b>{" "}
                        {booking.pickup_location || "-"}
                      </span>
                      <MapPin
                        size={14}
                        className="text-gray-400 ml-1 flex-shrink-0"
                      />
                      <span>
                        <b className="text-gray-400">To:</b>{" "}
                        {booking.drop_location || "-"}
                      </span>
                    </div>
                    {(booking.transfer_flight || booking.transfer_ftime) && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {booking.transfer_flight && (
                          <span className="flex items-center gap-1">
                            <Plane size={14} className="text-gray-400" />
                            <b className="text-gray-400">Flight:</b>{" "}
                            {booking.transfer_flight}
                          </span>
                        )}
                        {booking.transfer_ftime && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-gray-400" />
                            {booking.transfer_ftime}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-2.5 mt-2.5 border-t border-gray-100">
                <span className="text-gray-500">
                  Agent:{" "}
                  <span className="font-medium text-gray-600">
                    {booking.agent_name || "-"}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500">
                    {booking.reference_id || `#${booking.id}`}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                  >
                    {translateStatus(booking.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingList;
