import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Search, Plus, X } from "lucide-react";
import { fetchAllBookings } from "../../services/bookingService";

const BookingSelector = forwardRef(
  (
    {
      onBookingSelect,
      onCreateNew,
      isCreatingNew,
      selectedBookingId,
      onCancelCreate,
    },
    ref,
  ) => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const loadBookings = async () => {
      setIsLoading(true);
      const { bookings: data } = await fetchAllBookings();
      setBookings(data);
      setIsLoading(false);
    };

    useEffect(() => {
      loadBookings();
    }, []);

    useImperativeHandle(ref, () => ({
      refreshBookings: loadBookings,
    }));

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

    const handleSelect = (booking) => {
      onBookingSelect(
        booking.id,
        booking.reference_id,
        {
          tourCount: booking.tour_count || 0,
          transferCount: booking.transfer_count || 0,
        },
        booking,
      );
    };

    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              placeholder="Search by name, agent, or reference ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isCreatingNew ? (
            <button
              type="button"
              onClick={onCancelCreate}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 flex items-center gap-1.5 border border-gray-200"
            >
              <X size={16} /> Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={onCreateNew}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={16} /> New Booking
            </button>
          )}
        </div>

        {!isCreatingNew && (
          <div className="max-h-48 overflow-auto border border-gray-200 rounded-xl">
            {isLoading ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No bookings found
              </div>
            ) : (
              filtered.slice(0, 20).map((booking) => (
                <button
                  key={booking.id}
                  type="button"
                  onClick={() => handleSelect(booking)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 flex justify-between items-center border-b border-gray-100 last:border-0 transition-colors ${
                    selectedBookingId === booking.reference_id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  <div>
                    <span className="font-medium">
                      {booking.first_name} {booking.last_name}
                    </span>
                    <span className="text-gray-400 ml-2 text-xs">
                      ({booking.agent_name || "No agent"})
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 flex gap-2">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                      {booking.reference_id || `#${booking.id}`}
                    </span>
                    <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">
                      {booking.tour_count || 0}T
                    </span>
                    <span className="bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded">
                      {booking.transfer_count || 0}Tr
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  },
);

BookingSelector.displayName = "BookingSelector";
export default BookingSelector;
