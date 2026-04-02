import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import {
  RefreshCcw,
  CalendarDays,
  CheckSquare,
  Square,
  FileSpreadsheet,
  Search,
  Camera,
  Car,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  BarChart3,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useInformation } from "../contexts/InformationContext";
import { notify } from "../components/ui/Notification";
import {
  fetchAllTourBookingsInRange,
  fetchAllTransferBookingsInRange,
} from "../services/paymentService";
import { exportReportToExcel } from "../services/reportService";
import ExportModal from "../components/report/ExportModal";
import ColumnsDropdown from "../components/report/ColumnsDropdown";
import FilterInputWithAdd from "../components/common/FilterInputWithAdd";
import SelectedFiltersDisplay from "../components/common/SelectedFiltersDisplay";

const ITEMS_PER_PAGE = 50;

const ALL_COLUMNS = [
  { key: "Date", label: "Date" },
  { key: "Type", label: "Type" },
  { key: "Agent", label: "Agent" },
  { key: "ReferenceID", label: "Reference ID" },
  { key: "CustomerName", label: "Customer Name" },
  { key: "Pax", label: "Pax" },
  { key: "PickupTime", label: "Pickup Time" },
  { key: "Hotel", label: "Hotel" },
  { key: "Details", label: "Details" },
  { key: "PickupFrom", label: "Pickup From" },
  { key: "DropTo", label: "Drop To" },
  { key: "Flight", label: "Flight" },
  { key: "FlightTime", label: "Flight Time" },
  { key: "SendTo", label: "Send To" },
  { key: "Note", label: "Note" },
  { key: "Cost", label: "Cost" },
  { key: "Sell", label: "Sell" },
  { key: "Profit", label: "Profit" },
];

const Report = () => {
  const { agents, tourRecipients, transferRecipients } = useInformation();

  // Filter states
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedTourRecipients, setSelectedTourRecipients] = useState([]);
  const [selectedTransferRecipients, setSelectedTransferRecipients] = useState(
    [],
  );
  const [currentAgentValue, setCurrentAgentValue] = useState("");
  const [currentTourValue, setCurrentTourValue] = useState("");
  const [currentTransferValue, setCurrentTransferValue] = useState("");

  // Search & tab
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Export states
  const [exportFormat, setExportFormat] = useState("combined");
  const [isExporting, setIsExporting] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Data states
  const [tourBookings, setTourBookings] = useState([]);
  const [transferBookings, setTransferBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selection states
  const [selectedTourIds, setSelectedTourIds] = useState(new Set());
  const [selectedTransferIds, setSelectedTransferIds] = useState(new Set());

  // Sort
  const [sortKey, setSortKey] = useState("Date");
  const [sortDirection, setSortDirection] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    Date: true,
    Type: true,
    Agent: true,
    ReferenceID: false,
    CustomerName: true,
    Pax: true,
    PickupTime: false,
    Hotel: false,
    Details: false,
    PickupFrom: false,
    DropTo: false,
    Flight: false,
    FlightTime: false,
    SendTo: true,
    Note: false,
    Cost: true,
    Sell: true,
    Profit: true,
  });

  // Filter panel
  const [showFilters, setShowFilters] = useState(true);

  // Auto-fetch when filters change
  useEffect(() => {
    const hasFilters =
      selectedAgents.length > 0 ||
      selectedTourRecipients.length > 0 ||
      selectedTransferRecipients.length > 0;

    if (hasFilters) {
      fetchFilteredData();
    } else {
      setTourBookings([]);
      setTransferBookings([]);
      setSelectedTourIds(new Set());
      setSelectedTransferIds(new Set());
    }
  }, [
    startDate,
    endDate,
    selectedAgents,
    selectedTourRecipients,
    selectedTransferRecipients,
  ]);

  // Reset page when filters/search/tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    activeTab,
    sortKey,
    sortDirection,
    selectedAgents,
    selectedTourRecipients,
    selectedTransferRecipients,
  ]);

  // ===== Combined Data =====

  const combinedData = useMemo(() => {
    const tours = tourBookings.map((b) => ({
      ...b,
      _type: "tour",
      _date: b.tour_date,
      _time: b.tour_pickup_time,
      _customerName: `${b.first_name || ""} ${b.last_name || ""}`.trim(),
      _profit:
        (parseFloat(b.selling_price) || 0) - (parseFloat(b.cost_price) || 0),
    }));
    const transfers = transferBookings.map((b) => ({
      ...b,
      _type: "transfer",
      _date: b.transfer_date,
      _time: b.transfer_time,
      _customerName: `${b.first_name || ""} ${b.last_name || ""}`.trim(),
      _profit:
        (parseFloat(b.selling_price) || 0) - (parseFloat(b.cost_price) || 0),
    }));
    return [...tours, ...transfers];
  }, [tourBookings, transferBookings]);

  // ===== Filtered + Sorted + Paginated Data =====

  const { displayData, totalFiltered, totalPages, financialSummary } =
    useMemo(() => {
      // Tab filter
      let data = combinedData;
      if (activeTab === "tour") data = data.filter((b) => b._type === "tour");
      if (activeTab === "transfer")
        data = data.filter((b) => b._type === "transfer");

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        data = data.filter(
          (b) =>
            b._customerName.toLowerCase().includes(term) ||
            (b.agent_name || "").toLowerCase().includes(term) ||
            (b.reference_id || "").toLowerCase().includes(term) ||
            (b.send_to || "").toLowerCase().includes(term) ||
            (b.note || "").toLowerCase().includes(term),
        );
      }

      // Financial summary (before pagination)
      const totalCost = data.reduce(
        (s, b) => s + (parseFloat(b.cost_price) || 0),
        0,
      );
      const totalSell = data.reduce(
        (s, b) => s + (parseFloat(b.selling_price) || 0),
        0,
      );
      const totalProfit = totalSell - totalCost;

      // Sort
      const getSortValue = (b) => {
        switch (sortKey) {
          case "Date":
            return b._date || "";
          case "Type":
            return b._type;
          case "Agent":
            return (b.agent_name || "").toLowerCase();
          case "CustomerName":
            return b._customerName.toLowerCase();
          case "Pax":
            return (
              (parseInt(b.pax_adt) || 0) +
              (parseInt(b.pax_chd) || 0) +
              (parseInt(b.pax_inf) || 0)
            );
          case "Cost":
            return parseFloat(b.cost_price) || 0;
          case "Sell":
            return parseFloat(b.selling_price) || 0;
          case "Profit":
            return b._profit;
          case "SendTo":
            return (b.send_to || "").toLowerCase();
          case "PickupTime":
            return b._time || "";
          default:
            return "";
        }
      };

      data.sort((a, b) => {
        const va = getSortValue(a);
        const vb = getSortValue(b);
        const cmp =
          typeof va === "number"
            ? va - vb
            : String(va).localeCompare(String(vb));
        return sortDirection === "asc" ? cmp : -cmp;
      });

      const totalFiltered = data.length;
      const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const displayData = data.slice(start, start + ITEMS_PER_PAGE);

      return {
        displayData,
        totalFiltered,
        totalPages,
        financialSummary: { totalCost, totalSell, totalProfit },
      };
    }, [
      combinedData,
      activeTab,
      searchTerm,
      sortKey,
      sortDirection,
      currentPage,
    ]);

  // ===== Data Fetching =====

  const fetchFilteredData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allTours, allTransfers] = await Promise.all([
        fetchAllTourBookingsInRange(startDate, endDate),
        fetchAllTransferBookingsInRange(startDate, endDate),
      ]);

      let filteredTours = [];
      let filteredTransfers = [];

      if (selectedAgents.length > 0) {
        const agentLower = selectedAgents.map((a) => a.toLowerCase());
        filteredTours.push(
          ...allTours.filter((b) =>
            agentLower.includes((b.agent_name || "").toLowerCase()),
          ),
        );
        filteredTransfers.push(
          ...allTransfers.filter((b) =>
            agentLower.includes((b.agent_name || "").toLowerCase()),
          ),
        );
      }

      if (selectedTourRecipients.length > 0) {
        const recLower = selectedTourRecipients.map((r) => r.toLowerCase());
        filteredTours.push(
          ...allTours.filter((b) =>
            recLower.includes((b.send_to || "").toLowerCase()),
          ),
        );
      }

      if (selectedTransferRecipients.length > 0) {
        const recLower = selectedTransferRecipients.map((r) => r.toLowerCase());
        filteredTransfers.push(
          ...allTransfers.filter((b) =>
            recLower.includes((b.send_to || "").toLowerCase()),
          ),
        );
      }

      const uniqueTours = filteredTours.filter(
        (b, i, self) => i === self.findIndex((x) => x.id === b.id),
      );
      const uniqueTransfers = filteredTransfers.filter(
        (b, i, self) => i === self.findIndex((x) => x.id === b.id),
      );

      setTourBookings(uniqueTours);
      setTransferBookings(uniqueTransfers);
      setSelectedTourIds(new Set());
      setSelectedTransferIds(new Set());
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Cannot load data");
      setTourBookings([]);
      setTransferBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDataForRange = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tours, transfers] = await Promise.all([
        fetchAllTourBookingsInRange(startDate, endDate),
        fetchAllTransferBookingsInRange(startDate, endDate),
      ]);
      setTourBookings(tours);
      setTransferBookings(transfers);
      setSelectedTourIds(new Set());
      setSelectedTransferIds(new Set());
      notify.success(
        `Loaded all data: ${format(new Date(startDate), "dd/MM/yyyy")} - ${format(new Date(endDate), "dd/MM/yyyy")}`,
      );
    } catch (err) {
      console.error("Error fetching all data:", err);
      setError("Cannot load data");
      setTourBookings([]);
      setTransferBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== Filter Handlers =====

  const handleAddAgent = (agent) => {
    if (!selectedAgents.includes(agent))
      setSelectedAgents([...selectedAgents, agent]);
  };

  const handleAddTourRecipient = (recipient) => {
    if (!selectedTourRecipients.includes(recipient))
      setSelectedTourRecipients([...selectedTourRecipients, recipient]);
  };

  const handleAddTransferRecipient = (recipient) => {
    if (!selectedTransferRecipients.includes(recipient))
      setSelectedTransferRecipients([...selectedTransferRecipients, recipient]);
  };

  const handleRemoveFilter = (type, value) => {
    switch (type) {
      case "agent":
        setSelectedAgents(selectedAgents.filter((a) => a !== value));
        break;
      case "tour_recipient":
        setSelectedTourRecipients(
          selectedTourRecipients.filter((r) => r !== value),
        );
        break;
      case "transfer_recipient":
        setSelectedTransferRecipients(
          selectedTransferRecipients.filter((r) => r !== value),
        );
        break;
    }
  };

  const handleReset = () => {
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setEndDate(format(new Date(), "yyyy-MM-dd"));
    setSelectedAgents([]);
    setSelectedTourRecipients([]);
    setSelectedTransferRecipients([]);
    setCurrentAgentValue("");
    setCurrentTourValue("");
    setCurrentTransferValue("");
    setSelectedTourIds(new Set());
    setSelectedTransferIds(new Set());
    setExportFormat("combined");
    setSearchTerm("");
    setActiveTab("all");
    setSortKey("Date");
    setSortDirection("asc");
    setCurrentPage(1);
  };

  // ===== Selection Handlers =====

  const isSelected = (booking) => {
    return booking._type === "tour"
      ? selectedTourIds.has(booking.id)
      : selectedTransferIds.has(booking.id);
  };

  const handleToggleSelect = (booking) => {
    if (booking._type === "tour") {
      const next = new Set(selectedTourIds);
      next.has(booking.id) ? next.delete(booking.id) : next.add(booking.id);
      setSelectedTourIds(next);
    } else {
      const next = new Set(selectedTransferIds);
      next.has(booking.id) ? next.delete(booking.id) : next.add(booking.id);
      setSelectedTransferIds(next);
    }
  };

  const handleSelectAllOnPage = () => {
    const allSelected = displayData.every((b) => isSelected(b));
    if (allSelected) {
      // Deselect all on current page
      const tourIds = new Set(selectedTourIds);
      const transferIds = new Set(selectedTransferIds);
      displayData.forEach((b) => {
        if (b._type === "tour") tourIds.delete(b.id);
        else transferIds.delete(b.id);
      });
      setSelectedTourIds(tourIds);
      setSelectedTransferIds(transferIds);
    } else {
      // Select all on current page
      const tourIds = new Set(selectedTourIds);
      const transferIds = new Set(selectedTransferIds);
      displayData.forEach((b) => {
        if (b._type === "tour") tourIds.add(b.id);
        else transferIds.add(b.id);
      });
      setSelectedTourIds(tourIds);
      setSelectedTransferIds(transferIds);
    }
  };

  const allPageSelected =
    displayData.length > 0 && displayData.every((b) => isSelected(b));
  const totalSelected = selectedTourIds.size + selectedTransferIds.size;

  // ===== Sort Handler =====

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  // ===== Export =====

  const handleExport = () => {
    const selectedTours =
      selectedTourIds.size > 0
        ? tourBookings.filter((b) => selectedTourIds.has(b.id))
        : tourBookings;
    const selectedTransfers =
      selectedTransferIds.size > 0
        ? transferBookings.filter((b) => selectedTransferIds.has(b.id))
        : transferBookings;

    if (selectedTours.length === 0 && selectedTransfers.length === 0) {
      notify.error("No data to export");
      return;
    }
    setIsExportModalOpen(true);
  };

  const handleConfirmExport = async (
    finalTourBookings,
    finalTransferBookings,
  ) => {
    setIsExporting(true);
    setIsExportModalOpen(false);
    notify.info("Creating Excel file, please wait...");

    try {
      const result = await exportReportToExcel(
        finalTourBookings,
        finalTransferBookings,
        startDate,
        endDate,
        exportFormat,
        {
          agents: selectedAgents,
          tourRecipients: selectedTourRecipients,
          transferRecipients: selectedTransferRecipients,
        },
      );

      if (result.success) {
        notify.success(result.message);
      } else {
        notify.error(result.message);
      }
    } catch (error) {
      console.error("Export error:", error);
      notify.error("Error exporting data");
    } finally {
      setIsExporting(false);
    }
  };

  // ===== Formatting =====

  const formatPax = (booking) => {
    const adt = parseInt(booking.pax_adt) || 0;
    const chd = parseInt(booking.pax_chd) || 0;
    const inf = parseInt(booking.pax_inf) || 0;
    let parts = [];
    if (adt > 0) parts.push(adt.toString());
    if (chd > 0) parts.push(chd.toString());
    if (inf > 0) parts.push(inf.toString());
    return parts.length > 0 ? parts.join("+") : "0";
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

  const getCellValue = (booking, key) => {
    const isTour = booking._type === "tour";
    switch (key) {
      case "Date":
        return formatDateDisplay(booking._date);
      case "Type":
        return isTour ? "Tour" : "Transfer";
      case "Agent":
        return booking.agent_name || "-";
      case "ReferenceID":
        return booking.reference_id || "-";
      case "CustomerName":
        return booking._customerName || "-";
      case "Pax":
        return formatPax(booking);
      case "PickupTime":
        return isTour
          ? booking.tour_pickup_time || "-"
          : booking.transfer_time || "-";
      case "Hotel":
        return isTour ? booking.tour_hotel || "-" : "-";
      case "Details":
        return isTour ? booking.tour_detail || "-" : "-";
      case "PickupFrom":
        return isTour ? "-" : booking.pickup_location || "-";
      case "DropTo":
        return isTour ? "-" : booking.drop_location || "-";
      case "Flight":
        return isTour
          ? booking.tour_flight || "-"
          : booking.transfer_flight || "-";
      case "FlightTime":
        return isTour
          ? booking.tour_ftime || "-"
          : booking.transfer_ftime || "-";
      case "SendTo":
        return booking.send_to || "-";
      case "Note":
        return booking.note || "-";
      case "Cost":
        return formatCurrency(booking.cost_price);
      case "Sell":
        return formatCurrency(booking.selling_price);
      case "Profit":
        return formatCurrency(booking._profit);
      default:
        return "";
    }
  };

  // ===== Sort icon =====

  const SortIcon = ({ columnKey }) => {
    if (sortKey !== columnKey)
      return <ChevronsUpDown size={12} className="text-gray-300" />;
    return sortDirection === "asc" ? (
      <ChevronUp size={12} className="text-blue-600" />
    ) : (
      <ChevronDown size={12} className="text-blue-600" />
    );
  };

  const isRightAligned = (key) => ["Cost", "Sell", "Profit"].includes(key);
  const isTruncated = (key) =>
    ["Details", "Note", "PickupFrom", "DropTo", "Hotel"].includes(key);

  const activeColumns = ALL_COLUMNS.filter((col) => visibleColumns[col.key]);

  const hasData = tourBookings.length > 0 || transferBookings.length > 0;
  const hasFiltersSelected =
    selectedAgents.length > 0 ||
    selectedTourRecipients.length > 0 ||
    selectedTransferRecipients.length > 0;

  // ===== Render =====

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Report</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Create Reports and Export Booking Data
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Export Format */}
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 shadow-sm text-gray-600"
            >
              <option value="combined">Combined Sheet</option>
              <option value="separate">Separate Sheets</option>
            </select>
            <button
              onClick={handleExport}
              disabled={isExporting || !hasData}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium shadow-sm"
            >
              {isExporting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileSpreadsheet size={14} />
                  Export Excel
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50/50 transition-colors rounded-2xl"
          >
            <span>Data Filters</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showFilters && (
            <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
              {/* Date Range + Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4">
                {/* Start Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Start Date
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-9 pr-3 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 shadow-sm text-gray-600"
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    End Date
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="pl-9 pr-3 py-2.5 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 shadow-sm text-gray-600"
                    />
                  </div>
                </div>

                {/* Agent */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Agent
                  </label>
                  <FilterInputWithAdd
                    options={agents}
                    value={currentAgentValue}
                    onChange={setCurrentAgentValue}
                    onAdd={handleAddAgent}
                    placeholder="Select Agent"
                    selectedItems={selectedAgents}
                    name="agent_filter"
                  />
                </div>

                {/* Tour Recipient */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Send To (Tour)
                  </label>
                  <FilterInputWithAdd
                    options={tourRecipients}
                    value={currentTourValue}
                    onChange={setCurrentTourValue}
                    onAdd={handleAddTourRecipient}
                    placeholder="Tour Recipient"
                    selectedItems={selectedTourRecipients}
                    name="tour_recipient_filter"
                  />
                </div>

                {/* Transfer Recipient */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Send To (Transfer)
                  </label>
                  <FilterInputWithAdd
                    options={transferRecipients}
                    value={currentTransferValue}
                    onChange={setCurrentTransferValue}
                    onAdd={handleAddTransferRecipient}
                    placeholder="Transfer Recipient"
                    selectedItems={selectedTransferRecipients}
                    name="transfer_recipient_filter"
                  />
                </div>
              </div>

              {/* Selected Filters + Action Buttons */}
              <SelectedFiltersDisplay
                selectedAgents={selectedAgents}
                selectedTourRecipients={selectedTourRecipients}
                selectedTransferRecipients={selectedTransferRecipients}
                onRemove={handleRemoveFilter}
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-colors"
                >
                  <RefreshCcw size={13} />
                  Reset
                </button>
                <button
                  onClick={fetchAllDataForRange}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                >
                  <CalendarDays size={13} />
                  Show All Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        {hasData && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                  <BarChart3 size={14} className="text-gray-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  Total Items
                </span>
              </div>
              <p className="text-xl font-bold text-gray-800">
                {combinedData.length}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {totalSelected > 0
                  ? `${totalSelected} selected`
                  : `${totalFiltered} shown`}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                  <Camera size={14} className="text-green-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Tour</span>
              </div>
              <p className="text-xl font-bold text-green-600">
                {tourBookings.length}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {selectedTourIds.size > 0
                  ? `${selectedTourIds.size} selected`
                  : "items"}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Car size={14} className="text-blue-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  Transfer
                </span>
              </div>
              <p className="text-xl font-bold text-blue-600">
                {transferBookings.length}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {selectedTransferIds.size > 0
                  ? `${selectedTransferIds.size} selected`
                  : "items"}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <DollarSign size={14} className="text-amber-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">Total</span>
              </div>
              <p className="text-xl font-bold text-gray-800">
                {formatCurrency(financialSummary.totalSell)}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Cost: {formatCurrency(financialSummary.totalCost)}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <TrendingUp size={14} className="text-emerald-600" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  Profit
                </span>
              </div>
              <p
                className={`text-xl font-bold ${financialSummary.totalProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {formatCurrency(financialSummary.totalProfit)}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {financialSummary.totalSell > 0
                  ? `${((financialSummary.totalProfit / financialSummary.totalSell) * 100).toFixed(1)}% margin`
                  : "-"}
              </p>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          {/* Table Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-xl overflow-hidden">
                {[
                  { key: "all", label: "All" },
                  {
                    key: "tour",
                    label: `Tour (${tourBookings.length})`,
                    icon: Camera,
                  },
                  {
                    key: "transfer",
                    label: `Transfer (${transferBookings.length})`,
                    icon: Car,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 ${
                        activeTab === tab.key
                          ? "bg-white text-gray-800 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {Icon && <Icon size={12} />}
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-52">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Columns Dropdown */}
              <ColumnsDropdown
                columns={ALL_COLUMNS}
                visibleColumns={visibleColumns}
                onToggle={handleColumnToggle}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-gray-300" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 text-sm">
              {error}
            </div>
          ) : !hasData && !hasFiltersSelected ? (
            <div className="text-center py-16 text-gray-400">
              <BarChart3 size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">
                Select filters or click "Show All Data" to load data
              </p>
            </div>
          ) : !hasData ? (
            <div className="text-center py-16 text-gray-400">
              <BarChart3 size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">
                No data found matching the selected criteria
              </p>
            </div>
          ) : totalFiltered === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Search size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No results for "{searchTerm}"</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {/* Select All */}
                    <th className="px-3 py-2.5 text-center w-10">
                      <button
                        onClick={handleSelectAllOnPage}
                        className="text-gray-500 hover:text-blue-600"
                      >
                        {allPageSelected ? (
                          <CheckSquare size={15} />
                        ) : (
                          <Square size={15} />
                        )}
                      </button>
                    </th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-10">
                      #
                    </th>
                    {activeColumns.map((col) => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className={`px-3 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors select-none ${
                          isRightAligned(col.key) ? "text-right" : "text-left"
                        } ${isTruncated(col.key) ? "max-w-[140px]" : ""}`}
                      >
                        <span className="inline-flex items-center gap-1">
                          {col.label}
                          <SortIcon columnKey={col.key} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayData.map((booking, index) => {
                    const rowNum =
                      (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                    const selected = isSelected(booking);
                    const isTour = booking._type === "tour";

                    return (
                      <tr
                        key={`${booking._type}-${booking.id}`}
                        className={`hover:bg-gray-50/80 transition-colors ${selected ? "bg-blue-50/40" : ""}`}
                      >
                        <td className="px-3 py-2.5 text-center">
                          <button
                            onClick={() => handleToggleSelect(booking)}
                            className={`${isTour ? "text-green-600" : "text-blue-600"} hover:opacity-70`}
                          >
                            {selected ? (
                              <CheckSquare size={15} />
                            ) : (
                              <Square size={15} />
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-400">
                          {rowNum}
                        </td>
                        {activeColumns.map((col) => {
                          const value = getCellValue(booking, col.key);
                          return (
                            <td
                              key={col.key}
                              className={`px-3 py-2.5 text-sm ${
                                isRightAligned(col.key)
                                  ? "text-right tabular-nums"
                                  : ""
                              } ${isTruncated(col.key) ? "max-w-[140px] truncate" : ""} ${
                                col.key === "Profit"
                                  ? booking._profit >= 0
                                    ? "text-emerald-600 font-medium"
                                    : "text-red-600 font-medium"
                                  : "text-gray-700"
                              }`}
                              title={isTruncated(col.key) ? value : undefined}
                            >
                              {col.key === "Type" ? (
                                <span
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    isTour
                                      ? "bg-green-100 text-green-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {isTour ? (
                                    <Camera size={10} />
                                  ) : (
                                    <Car size={10} />
                                  )}
                                  {value}
                                </span>
                              ) : (
                                value
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer - Pagination + Totals */}
          {hasData && totalFiltered > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50 gap-3">
              {/* Left: info */}
              <div className="text-xs text-gray-500">
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * ITEMS_PER_PAGE + 1,
                  totalFiltered,
                )}
                -{Math.min(currentPage * ITEMS_PER_PAGE, totalFiltered)} of{" "}
                {totalFiltered} items
                {totalSelected > 0 && (
                  <span className="ml-2 text-blue-600 font-medium">
                    ({totalSelected} selected)
                  </span>
                )}
              </div>

              {/* Center: summary */}
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">
                  Cost:{" "}
                  <span className="font-semibold text-gray-700">
                    {formatCurrency(financialSummary.totalCost)}
                  </span>
                </span>
                <span className="text-gray-500">
                  Sell:{" "}
                  <span className="font-semibold text-gray-700">
                    {formatCurrency(financialSummary.totalSell)}
                  </span>
                </span>
                <span className="text-gray-500">
                  Profit:{" "}
                  <span
                    className={`font-semibold ${financialSummary.totalProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {formatCurrency(financialSummary.totalProfit)}
                  </span>
                </span>
              </div>

              {/* Right: pagination */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      if (totalPages <= 7) return true;
                      if (page === 1 || page === totalPages) return true;
                      if (Math.abs(page - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((page, idx, arr) => (
                      <React.Fragment key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-1 text-gray-400 text-xs">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Export Modal */}
        {isExportModalOpen && (
          <ExportModal
            tourBookings={
              selectedTourIds.size > 0
                ? tourBookings.filter((b) => selectedTourIds.has(b.id))
                : tourBookings
            }
            transferBookings={
              selectedTransferIds.size > 0
                ? transferBookings.filter((b) => selectedTransferIds.has(b.id))
                : transferBookings
            }
            onConfirm={handleConfirmExport}
            onCancel={() => setIsExportModalOpen(false)}
            startDate={startDate}
            endDate={endDate}
            exportFormat={exportFormat}
          />
        )}
      </div>
    </div>
  );
};

export default Report;
