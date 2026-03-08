import React, { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import {
  fetchTourDatesInRange,
  fetchTransferDatesInRange,
} from "../../services/bookingService";

const BookingCalendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const [calendarDays, setCalendarDays] = useState([]);
  const [bookingData, setBookingData] = useState({
    tourDates: new Set(),
    transferDates: new Set(),
    bothDates: new Set(),
  });
  const [isLoading, setIsLoading] = useState(false);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    generateCalendarDays(currentMonth);
    fetchBookedDates(currentMonth);
  }, [currentMonth]);

  useEffect(() => {
    if (!isSameMonth(selectedDate, currentMonth)) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate]);

  const generateCalendarDays = (date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const start = startOfWeek(monthStart, { weekStartsOn: 0 });
    const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
    setCalendarDays(eachDayOfInterval({ start, end }));
  };

  const fetchBookedDates = async (date) => {
    setIsLoading(true);
    try {
      const startDate = format(startOfMonth(date), "yyyy-MM-dd");
      const endDate = format(endOfMonth(date), "yyyy-MM-dd");

      const [tourDatesArr, transferDatesArr] = await Promise.all([
        fetchTourDatesInRange(startDate, endDate),
        fetchTransferDatesInRange(startDate, endDate),
      ]);

      const tourDates = new Set(tourDatesArr);
      const transferDates = new Set();
      const bothDates = new Set();

      transferDatesArr.forEach((d) => {
        if (tourDates.has(d)) {
          bothDates.add(d);
          tourDates.delete(d);
        } else {
          transferDates.add(d);
        }
      });

      setBookingData({ tourDates, transferDates, bothDates });
    } catch {
      setBookingData({
        tourDates: new Set(),
        transferDates: new Set(),
        bothDates: new Set(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBookingType = (day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    if (bookingData.bothDates.has(dateStr)) return "both";
    if (bookingData.tourDates.has(dateStr)) return "tour";
    if (bookingData.transferDates.has(dateStr)) return "transfer";
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Calendar size={20} />
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Legend */}
      <div className="px-4 py-2.5 text-xs text-gray-500 flex gap-4 justify-center border-b border-gray-100 bg-gray-50/50 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <span>Tour</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
          <span>Transfer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500" />
          <span>Both</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-medium text-gray-400 text-xs tracking-wide py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-7 w-7 border-2 border-blue-200 border-t-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              const bookingType = getBookingType(day);
              const selected = isSameDay(day, selectedDate);
              const today = isSameDay(day, new Date());
              const inCurrentMonth = isSameMonth(day, currentMonth);

              let bookingStyle = "";
              if (!selected && bookingType) {
                if (bookingType === "tour")
                  bookingStyle = "bg-cyan-50 text-cyan-700 hover:bg-cyan-100";
                else if (bookingType === "transfer")
                  bookingStyle = "bg-teal-50 text-teal-700 hover:bg-teal-100";
                else
                  bookingStyle =
                    "bg-gradient-to-br from-cyan-50 to-teal-50 text-gray-700 hover:from-cyan-100 hover:to-teal-100";
              }

              return (
                <button
                  key={i}
                  onClick={() => inCurrentMonth && onDateSelect(day)}
                  disabled={!inCurrentMonth}
                  className={`h-10 w-full rounded-lg flex items-center justify-center relative text-sm transition-all duration-200
                    ${!inCurrentMonth ? "text-gray-300 cursor-default" : "cursor-pointer"}
                    ${selected ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-200 hover:bg-blue-700" : inCurrentMonth ? "hover:bg-gray-100" : ""}
                    ${today && !selected ? "border-2 border-blue-400 text-blue-600 font-bold" : "border border-transparent"}
                    ${bookingStyle}
                  `}
                >
                  {format(day, "d")}
                  {bookingType && !selected && (
                    <span
                      className={`absolute bottom-1 w-1.5 h-1.5 rounded-full
                      ${bookingType === "tour" ? "bg-cyan-500" : bookingType === "transfer" ? "bg-teal-500" : "bg-gradient-to-r from-cyan-500 to-teal-500"}
                    `}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Date */}
      <div className="bg-gray-50 p-3 border-t border-gray-100 text-center text-sm">
        <span className="text-gray-500">Selected: </span>
        <span className="text-blue-600 font-bold">
          {format(selectedDate, "d MMMM yyyy")}
        </span>
      </div>
    </div>
  );
};

export default BookingCalendar;
