import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import {
  X,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Search,
  Camera,
  Car,
  DollarSign,
  TrendingUp,
  MinusSquare,
} from "lucide-react";

const ExportModal = ({
  tourBookings,
  transferBookings,
  onConfirm,
  onCancel,
  startDate,
  endDate,
  exportFormat,
}) => {
  const [selectedTourIds, setSelectedTourIds] = useState(new Set());
  const [selectedTransferIds, setSelectedTransferIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // Filter bookings by date range
  const filteredTourBookings = useMemo(() => {
    if (!tourBookings || tourBookings.length === 0) return [];
    return tourBookings.filter((b) => {
      const d = format(new Date(b.tour_date), "yyyy-MM-dd");
      return d >= startDate && d <= endDate;
    });
  }, [tourBookings, startDate, endDate]);

  const filteredTransferBookings = useMemo(() => {
    if (!transferBookings || transferBookings.length === 0) return [];
    return transferBookings.filter((b) => {
      const d = format(new Date(b.transfer_date), "yyyy-MM-dd");
      return d >= startDate && d <= endDate;
    });
  }, [transferBookings, startDate, endDate]);

  // Auto-select all on load
  useEffect(() => {
    setSelectedTourIds(new Set(filteredTourBookings.map((b) => b.id)));
    setSelectedTransferIds(new Set(filteredTransferBookings.map((b) => b.id)));
  }, [filteredTourBookings, filteredTransferBookings]);

  // Combined + grouped by date
  const { groupedBookings, sortedDates, allBookings } = useMemo(() => {
    const all = [
      ...filteredTourBookings.map((b) => ({
        ...b,
        _type: "tour",
        _date: b.tour_date,
        _time: b.tour_pickup_time,
        _customerName: `${b.first_name || ""} ${b.last_name || ""}`.trim(),
      })),
      ...filteredTransferBookings.map((b) => ({
        ...b,
        _type: "transfer",
        _date: b.transfer_date,
        _time: b.transfer_time,
        _customerName: `${b.first_name || ""} ${b.last_name || ""}`.trim(),
      })),
    ];

    // Search filter
    let filtered = all;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = all.filter(
        (b) =>
          b._customerName.toLowerCase().includes(term) ||
          (b.agent_name || "").toLowerCase().includes(term) ||
          (b.send_to || "").toLowerCase().includes(term) ||
          (b.reference_id || "").toLowerCase().includes(term),
      );
    }

    const grouped = {};
    filtered.forEach((b) => {
      if (!grouped[b._date]) grouped[b._date] = [];
      grouped[b._date].push(b);
    });

    Object.values(grouped).forEach((arr) =>
      arr.sort((a, b) => (a._time || "23:59").localeCompare(b._time || "23:59")),
    );

    return {
      groupedBookings: grouped,
      sortedDates: Object.keys(grouped).sort(),
      allBookings: filtered,
    };
  }, [filteredTourBookings, filteredTransferBookings, searchTerm]);

  // Financial summary based on selection
  const summary = useMemo(() => {
    const selectedTours = filteredTourBookings.filter((b) => selectedTourIds.has(b.id));
    const selectedTransfers = filteredTransferBookings.filter((b) => selectedTransferIds.has(b.id));
    const allSelected = [...selectedTours, ...selectedTransfers];

    const totalCost = allSelected.reduce((s, b) => s + (parseFloat(b.cost_price) || 0), 0);
    const totalSell = allSelected.reduce((s, b) => s + (parseFloat(b.selling_price) || 0), 0);

    return {
      totalBookings: filteredTourBookings.length + filteredTransferBookings.length,
      selectedCount: allSelected.length,
      tourSelected: selectedTours.length,
      transferSelected: selectedTransfers.length,
      totalCost,
      totalSell,
      totalProfit: totalSell - totalCost,
    };
  }, [filteredTourBookings, filteredTransferBookings, selectedTourIds, selectedTransferIds]);

  // Selection helpers
  const isBookingSelected = (booking) =>
    booking._type === "tour"
      ? selectedTourIds.has(booking.id)
      : selectedTransferIds.has(booking.id);

  const toggleBooking = (booking) => {
    if (booking._type === "tour") {
      setSelectedTourIds((prev) => {
        const next = new Set(prev);
        next.has(booking.id) ? next.delete(booking.id) : next.add(booking.id);
        return next;
      });
    } else {
      setSelectedTransferIds((prev) => {
        const next = new Set(prev);
        next.has(booking.id) ? next.delete(booking.id) : next.add(booking.id);
        return next;
      });
    }
  };

  const handleSelectAll = () => {
    setSelectedTourIds(new Set(filteredTourBookings.map((b) => b.id)));
    setSelectedTransferIds(new Set(filteredTransferBookings.map((b) => b.id)));
  };

  const handleDeselectAll = () => {
    setSelectedTourIds(new Set());
    setSelectedTransferIds(new Set());
  };

  // Toggle all visible (search-filtered) bookings on current view
  const toggleVisibleBookings = () => {
    const allVisible = allBookings.every((b) => isBookingSelected(b));
    if (allVisible) {
      // Deselect only visible
      const tourIds = new Set(selectedTourIds);
      const transferIds = new Set(selectedTransferIds);
      allBookings.forEach((b) => {
        if (b._type === "tour") tourIds.delete(b.id);
        else transferIds.delete(b.id);
      });
      setSelectedTourIds(tourIds);
      setSelectedTransferIds(transferIds);
    } else {
      // Select all visible
      const tourIds = new Set(selectedTourIds);
      const transferIds = new Set(selectedTransferIds);
      allBookings.forEach((b) => {
        if (b._type === "tour") tourIds.add(b.id);
        else transferIds.add(b.id);
      });
      setSelectedTourIds(tourIds);
      setSelectedTransferIds(transferIds);
    }
  };

  const allVisibleSelected = allBookings.length > 0 && allBookings.every((b) => isBookingSelected(b));
  const someVisibleSelected = allBookings.some((b) => isBookingSelected(b)) && !allVisibleSelected;

  const handleConfirmExport = () => {
    const finalTours = filteredTourBookings.filter((b) => selectedTourIds.has(b.id));
    const finalTransfers = filteredTransferBookings.filter((b) => selectedTransferIds.has(b.id));
    onConfirm(finalTours, finalTransfers);
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy");
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "0";
    return parseFloat(amount).toLocaleString();
  };

  const formatPax = (booking) => {
    const adt = parseInt(booking.pax_adt) || 0;
    const chd = parseInt(booking.pax_chd) || 0;
    const inf = parseInt(booking.pax_inf) || 0;
    const parts = [];
    if (adt > 0) parts.push(adt.toString());
    if (chd > 0) parts.push(chd.toString());
    if (inf > 0) parts.push(inf.toString());
    return parts.length > 0 ? parts.join("+") : "0";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-green-600" />
              Export Preview
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {format(new Date(startDate), "dd/MM/yyyy")} -{" "}
              {format(new Date(endDate), "dd/MM/yyyy")}
              <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-medium">
                {exportFormat === "combined" ? "Combined" : "Separate"}
              </span>
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-2.5 py-1.5 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Deselect All
            </button>

            {/* Quick counts */}
            <div className="hidden sm:flex items-center gap-2 ml-2 text-[11px] text-gray-500">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-green-700 rounded">
                <Camera size={10} />
                {summary.tourSelected}/{filteredTourBookings.length}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                <Car size={10} />
                {summary.transferSelected}/{filteredTransferBookings.length}
              </span>
            </div>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search customer, agent, send to..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={11} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {sortedDates.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">
                {searchTerm ? `No results for "${searchTerm}"` : "No data to export"}
              </p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-center w-8">
                    <button
                      onClick={toggleVisibleBookings}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      {allVisibleSelected ? (
                        <CheckSquare size={14} />
                      ) : someVisibleSelected ? (
                        <MinusSquare size={14} />
                      ) : (
                        <Square size={14} />
                      )}
                    </button>
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Agent
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Pax
                  </th>
                  <th className="px-2 py-2 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Send To
                  </th>
                  <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Sell
                  </th>
                  <th className="px-2 py-2 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Profit
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedDates.map((date) => (
                  <React.Fragment key={date}>
                    {/* Date group header */}
                    <tr className="bg-gray-100/70">
                      <td colSpan={10} className="px-3 py-1.5">
                        <span className="text-xs font-semibold text-gray-600">
                          {formatDateDisplay(date)}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-2">
                          ({groupedBookings[date].length} items)
                        </span>
                      </td>
                    </tr>

                    {/* Booking rows */}
                    {groupedBookings[date].map((booking) => {
                      const isTour = booking._type === "tour";
                      const selected = isBookingSelected(booking);
                      const cost = parseFloat(booking.cost_price) || 0;
                      const sell = parseFloat(booking.selling_price) || 0;
                      const profit = sell - cost;

                      return (
                        <tr
                          key={`${booking._type}-${booking.id}`}
                          onClick={() => toggleBooking(booking)}
                          className={`border-b border-gray-50 cursor-pointer transition-colors ${
                            selected
                              ? "bg-blue-50/50 hover:bg-blue-50"
                              : "bg-white hover:bg-gray-50 opacity-60"
                          }`}
                        >
                          <td className="px-3 py-2 text-center">
                            <button
                              className={`${isTour ? "text-green-600" : "text-blue-600"} hover:opacity-70`}
                            >
                              {selected ? <CheckSquare size={14} /> : <Square size={14} />}
                            </button>
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-500">
                            {isTour
                              ? booking.tour_pickup_time || "-"
                              : booking.transfer_time || "-"}
                          </td>
                          <td className="px-2 py-2">
                            <span
                              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isTour
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {isTour ? <Camera size={9} /> : <Car size={9} />}
                              {isTour ? "Tour" : "TF"}
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <div className="text-sm font-medium text-gray-800 truncate max-w-[160px]">
                              {booking._customerName || "No Name"}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-600 hidden md:table-cell truncate max-w-[100px]">
                            {booking.agent_name || "-"}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-600 hidden md:table-cell">
                            {formatPax(booking)}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-600 hidden lg:table-cell truncate max-w-[100px]">
                            {booking.send_to || "-"}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-600 text-right tabular-nums">
                            {formatCurrency(cost)}
                          </td>
                          <td className="px-2 py-2 text-xs text-gray-800 text-right tabular-nums font-medium">
                            {formatCurrency(sell)}
                          </td>
                          <td
                            className={`px-2 py-2 text-xs text-right tabular-nums font-medium hidden sm:table-cell ${
                              profit >= 0 ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {formatCurrency(profit)}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/80">
          {/* Financial Summary */}
          <div className="flex items-center justify-center gap-6 px-5 py-2.5 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-xs">
              <DollarSign size={12} className="text-gray-400" />
              <span className="text-gray-500">Cost:</span>
              <span className="font-semibold text-gray-700">
                {formatCurrency(summary.totalCost)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <DollarSign size={12} className="text-gray-400" />
              <span className="text-gray-500">Sell:</span>
              <span className="font-semibold text-gray-700">
                {formatCurrency(summary.totalSell)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <TrendingUp size={12} className={summary.totalProfit >= 0 ? "text-emerald-500" : "text-red-500"} />
              <span className="text-gray-500">Profit:</span>
              <span
                className={`font-semibold ${summary.totalProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {formatCurrency(summary.totalProfit)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between px-5 py-3">
            <div className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{summary.selectedCount}</span>
              <span className="mx-1">of</span>
              <span className="font-semibold text-gray-700">{summary.totalBookings}</span>
              <span className="ml-1">items selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExport}
                disabled={summary.selectedCount === 0}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FileSpreadsheet size={14} />
                Export ({summary.selectedCount})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
