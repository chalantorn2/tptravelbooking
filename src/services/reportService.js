import ExcelJS from "exceljs";
import { format } from "date-fns";

const generateFileName = (startDate, endDate, selectedFilters) => {
  const startFormatted = format(new Date(startDate), "ddMMyyyy");
  const endFormatted = format(new Date(endDate), "ddMMyyyy");
  const dateCreated = format(new Date(), "yyyyMMdd");

  const agentCount = selectedFilters.agents?.length || 0;
  const tourCount = selectedFilters.tourRecipients?.length || 0;
  const transferCount = selectedFilters.transferRecipients?.length || 0;
  const totalFilters = agentCount + tourCount + transferCount;

  let filterText = "";

  if (totalFilters > 1) {
    const parts = [];
    if (agentCount > 0) parts.push(`${agentCount}agent${agentCount > 1 ? "s" : ""}`);
    if (tourCount > 0) parts.push(`${tourCount}tour${tourCount > 1 ? "s" : ""}`);
    if (transferCount > 0) parts.push(`${transferCount}transfer${transferCount > 1 ? "s" : ""}`);
    filterText = parts.join("-");
  } else if (totalFilters === 1) {
    if (agentCount === 1) filterText = selectedFilters.agents[0];
    else if (tourCount === 1) filterText = `Tour${selectedFilters.tourRecipients[0]}`;
    else if (transferCount === 1) filterText = `Transfer${selectedFilters.transferRecipients[0]}`;
  } else {
    filterText = "All";
  }

  return `Report${filterText}_${startFormatted}-${endFormatted}_${dateCreated}.xlsx`;
};

export const exportReportToExcel = async (
  tourBookings,
  transferBookings,
  startDate,
  endDate,
  exportFormat = "combined",
  selectedFilters = { agents: [], tourRecipients: [], transferRecipients: [] }
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "TP Travel Booking System";
    workbook.lastModifiedBy = "TP Travel";
    workbook.created = new Date();
    workbook.modified = new Date();

    const dateRangeText = `${format(new Date(startDate), "dd/MM/yyyy")} - ${format(new Date(endDate), "dd/MM/yyyy")}`;
    const sheetName = format(new Date(startDate), "MMM-yyyy");
    const fileName = generateFileName(startDate, endDate, selectedFilters);

    const hasTour = tourBookings.length > 0;
    const hasTransfer = transferBookings.length > 0;

    if (!hasTour && !hasTransfer) {
      throw new Error("No data to export");
    }

    if (exportFormat === "separate") {
      if (hasTour) {
        setupTourSheet(workbook.addWorksheet("Tour Bookings"), tourBookings, dateRangeText);
      }
      if (hasTransfer) {
        setupTransferSheet(workbook.addWorksheet("Transfer Bookings"), transferBookings, dateRangeText);
      }
    } else {
      setupCombinedSheet(workbook.addWorksheet(sheetName), tourBookings, transferBookings, dateRangeText);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);

    return { success: true, fileName, message: `Export successful: ${fileName}` };
  } catch (error) {
    console.error("Error exporting report to Excel:", error);
    return { success: false, error: error.message, message: "Error exporting report" };
  }
};

// ===== Helper: format pax =====
const formatPax = (booking) => {
  const adt = parseInt(booking.pax_adt || 0);
  const chd = parseInt(booking.pax_chd || 0);
  const inf = parseInt(booking.pax_inf || 0);
  let parts = [];
  if (adt > 0) parts.push(adt.toString());
  if (chd > 0) parts.push(chd.toString());
  if (inf > 0) parts.push(inf.toString());
  return parts.length > 0 ? parts.join("+") : "0";
};

// ===== Combined Sheet =====
const setupCombinedSheet = (worksheet, tourBookings, transferBookings, dateRangeText) => {
  const allBookings = [
    ...tourBookings.map((b) => ({ ...b, _type: "tour", _date: b.tour_date, _time: b.tour_pickup_time })),
    ...transferBookings.map((b) => ({ ...b, _type: "transfer", _date: b.transfer_date, _time: b.transfer_time })),
  ];

  const groupedByDate = {};
  allBookings.forEach((b) => {
    if (!groupedByDate[b._date]) groupedByDate[b._date] = [];
    groupedByDate[b._date].push(b);
  });
  const sortedDates = Object.keys(groupedByDate).sort();

  worksheet.getCell("A1").value = "Booking List";
  worksheet.getCell("A1").font = { size: 16, bold: true };
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A2").value = dateRangeText;
  worksheet.getCell("A2").font = { size: 14, bold: true };
  worksheet.getCell("A2").alignment = { horizontal: "center" };
  worksheet.mergeCells("A1:S1");
  worksheet.mergeCells("A2:S2");

  let currentRow = 4;
  const columnWidths = Array(19).fill(10);

  const headers = [
    "No.", "Type", "Agent", "Customer Name", "Pax", "Pickup Time",
    "Hotel", "Details", "Pickup From", "Drop To", "Flight", "Flight Time",
    "Send To", "Remark", "", "Cost", "Sell", "Profit", "Note",
  ];

  for (const dateKey of sortedDates) {
    const bookingsOfDate = groupedByDate[dateKey].sort((a, b) => (a._time || "23:59").localeCompare(b._time || "23:59"));

    // Date header
    const dateCell = worksheet.getCell(currentRow, 1);
    dateCell.value = `Date: ${format(new Date(dateKey), "dd/MM/yyyy")}`;
    dateCell.font = { size: 14, bold: true };
    dateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE5E7EB" } };
    worksheet.mergeCells(`A${currentRow}:S${currentRow}`);
    currentRow++;

    // Column headers
    headers.forEach((header, i) => {
      const cell = worksheet.getCell(currentRow, i + 1);
      cell.value = header;
      if (header !== "") {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF6B7280" } };
      }
      cell.alignment = { horizontal: "center", vertical: "middle" };
      if (i !== 14) {
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      }
      columnWidths[i] = Math.max(columnWidths[i], header.length * 1.2);
    });
    currentRow++;

    // Data rows
    bookingsOfDate.forEach((booking, index) => {
      const rowData = prepareCombinedRowData(booking, index + 1);
      rowData.forEach((value, ci) => {
        const cell = worksheet.getCell(currentRow, ci + 1);
        cell.value = value;
        cell.alignment = { vertical: "middle", wrapText: true };
        if (ci !== 14) {
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        }
        if (ci >= 15 && ci <= 17) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFED7AA" } };
          cell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };
        }
        if (ci === 18) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEED9" } };
        }
        if (index % 2 === 0 && ci < 15) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8F9FA" } };
        }
        columnWidths[ci] = Math.max(columnWidths[ci], String(value).length * 1.2);
      });
      currentRow++;
    });
    currentRow++;
  }

  columnWidths.forEach((w, i) => { worksheet.getColumn(i + 1).width = Math.min(Math.max(w, 10), 50); });
  worksheet.getRow(1).height = 25;
  worksheet.getRow(2).height = 20;

  // Summary row
  currentRow++;
  const totalCost = allBookings.reduce((s, b) => s + (parseFloat(b.cost_price) || 0), 0);
  const totalSell = allBookings.reduce((s, b) => s + (parseFloat(b.selling_price) || 0), 0);
  const totalProfit = totalSell - totalCost;

  worksheet.getCell(currentRow, 1).value = "Summary";
  worksheet.getCell(currentRow, 1).font = { bold: true };
  worksheet.getCell(currentRow, 1).alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getCell(currentRow, 1).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
  worksheet.mergeCells(`A${currentRow}:N${currentRow}`);

  worksheet.getCell(currentRow, 16).value = totalCost.toLocaleString();
  worksheet.getCell(currentRow, 17).value = totalSell.toLocaleString();
  worksheet.getCell(currentRow, 18).value = totalProfit.toLocaleString();

  [16, 17, 18].forEach((ci) => {
    const cell = worksheet.getCell(currentRow, ci);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFED7AA" } };
    cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.font = { bold: true };
  });
};

// ===== Tour Sheet =====
const setupTourSheet = (worksheet, tourBookings, dateRangeText) => {
  const groupedByDate = {};
  tourBookings.forEach((b) => {
    if (!groupedByDate[b.tour_date]) groupedByDate[b.tour_date] = [];
    groupedByDate[b.tour_date].push(b);
  });
  const sortedDates = Object.keys(groupedByDate).sort();

  worksheet.getCell("A1").value = "Tour Booking List";
  worksheet.getCell("A1").font = { size: 16, bold: true, color: { argb: "FF16A34A" } };
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A2").value = dateRangeText;
  worksheet.getCell("A2").font = { size: 14, bold: true };
  worksheet.getCell("A2").alignment = { horizontal: "center" };
  worksheet.mergeCells("A1:N1");
  worksheet.mergeCells("A2:N2");

  let currentRow = 4;
  const columnWidths = Array(14).fill(10);
  const tourHeaders = ["No.", "Agent", "Customer Name", "Pax", "Pickup Time", "Hotel", "Details", "Send To", "Remark", "", "Cost", "Sell", "Profit", "Note"];

  for (const dateKey of sortedDates) {
    const bookingsOfDate = groupedByDate[dateKey].sort((a, b) => (a.tour_pickup_time || "23:59").localeCompare(b.tour_pickup_time || "23:59"));

    const dateCell = worksheet.getCell(currentRow, 1);
    dateCell.value = `Date: ${format(new Date(dateKey), "dd/MM/yyyy")}`;
    dateCell.font = { size: 14, bold: true };
    dateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE5E7EB" } };
    worksheet.mergeCells(`A${currentRow}:N${currentRow}`);
    currentRow++;

    tourHeaders.forEach((header, i) => {
      const cell = worksheet.getCell(currentRow, i + 1);
      cell.value = header;
      if (header !== "") {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF16A34A" } };
      }
      cell.alignment = { horizontal: "center", vertical: "middle" };
      if (i !== 9) cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      columnWidths[i] = Math.max(columnWidths[i], header.length * 1.2);
    });
    currentRow++;

    bookingsOfDate.forEach((booking, index) => {
      const rowData = prepareTourRowData(booking, index + 1);
      rowData.forEach((value, ci) => {
        const cell = worksheet.getCell(currentRow, ci + 1);
        cell.value = value;
        cell.alignment = { vertical: "middle", wrapText: true };
        if (ci !== 9) cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        if (ci >= 10 && ci <= 12) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFED7AA" } };
          cell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };
        }
        if (ci === 13) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEED9" } };
        if (index % 2 === 0 && ci < 10) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8F9FA" } };
        columnWidths[ci] = Math.max(columnWidths[ci], String(value).length * 1.2);
      });
      currentRow++;
    });
    currentRow++;
  }

  columnWidths.forEach((w, i) => { worksheet.getColumn(i + 1).width = Math.min(Math.max(w, 10), 50); });
  worksheet.getRow(1).height = 25;
  worksheet.getRow(2).height = 20;

  currentRow++;
  const totalCost = tourBookings.reduce((s, b) => s + (parseFloat(b.cost_price) || 0), 0);
  const totalSell = tourBookings.reduce((s, b) => s + (parseFloat(b.selling_price) || 0), 0);
  const totalProfit = totalSell - totalCost;

  worksheet.getCell(currentRow, 1).value = "Summary";
  worksheet.getCell(currentRow, 1).font = { bold: true };
  worksheet.getCell(currentRow, 1).alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getCell(currentRow, 1).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
  worksheet.mergeCells(`A${currentRow}:J${currentRow}`);

  worksheet.getCell(currentRow, 11).value = totalCost.toLocaleString();
  worksheet.getCell(currentRow, 12).value = totalSell.toLocaleString();
  worksheet.getCell(currentRow, 13).value = totalProfit.toLocaleString();

  [11, 12, 13].forEach((ci) => {
    const cell = worksheet.getCell(currentRow, ci);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFED7AA" } };
    cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.font = { bold: true };
  });
};

// ===== Transfer Sheet =====
const setupTransferSheet = (worksheet, transferBookings, dateRangeText) => {
  const groupedByDate = {};
  transferBookings.forEach((b) => {
    const dateKey = b.transfer_date;
    if (dateKey && !isNaN(new Date(dateKey).getTime())) {
      if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
      groupedByDate[dateKey].push(b);
    }
  });
  const sortedDates = Object.keys(groupedByDate).sort();

  worksheet.getCell("A1").value = "Transfer Booking List";
  worksheet.getCell("A1").font = { size: 16, bold: true, color: { argb: "FF2563EB" } };
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A2").value = dateRangeText;
  worksheet.getCell("A2").font = { size: 14, bold: true };
  worksheet.getCell("A2").alignment = { horizontal: "center" };
  worksheet.mergeCells("A1:P1");
  worksheet.mergeCells("A2:P2");

  let currentRow = 4;
  const columnWidths = Array(16).fill(10);
  const transferHeaders = ["No.", "Agent", "Customer Name", "Pax", "Pickup Time", "Pickup From", "Drop To", "Flight", "Flight Time", "Send To", "Remark", "", "Cost", "Sell", "Profit", "Note"];

  for (const dateKey of sortedDates) {
    const bookingsOfDate = groupedByDate[dateKey].sort((a, b) => (a.transfer_time || "23:59").localeCompare(b.transfer_time || "23:59"));

    const dateCell = worksheet.getCell(currentRow, 1);
    dateCell.value = `Date: ${format(new Date(dateKey), "dd/MM/yyyy")}`;
    dateCell.font = { size: 14, bold: true };
    dateCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE5E7EB" } };
    worksheet.mergeCells(`A${currentRow}:P${currentRow}`);
    currentRow++;

    transferHeaders.forEach((header, i) => {
      const cell = worksheet.getCell(currentRow, i + 1);
      cell.value = header;
      if (header !== "") {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
      }
      cell.alignment = { horizontal: "center", vertical: "middle" };
      if (i !== 11) cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      columnWidths[i] = Math.max(columnWidths[i], header.length * 1.2);
    });
    currentRow++;

    bookingsOfDate.forEach((booking, index) => {
      const rowData = prepareTransferRowData(booking, index + 1);
      rowData.forEach((value, ci) => {
        const cell = worksheet.getCell(currentRow, ci + 1);
        cell.value = value;
        cell.alignment = { vertical: "middle", wrapText: true };
        if (ci !== 11) cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        if (ci >= 12 && ci <= 14) {
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFED7AA" } };
          cell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };
        }
        if (ci === 15) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEED9" } };
        if (index % 2 === 0 && ci < 12) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8F9FA" } };
        columnWidths[ci] = Math.max(columnWidths[ci], String(value).length * 1.2);
      });
      currentRow++;
    });
    currentRow++;
  }

  columnWidths.forEach((w, i) => { worksheet.getColumn(i + 1).width = Math.min(Math.max(w, 10), 50); });
  worksheet.getRow(1).height = 25;
  worksheet.getRow(2).height = 20;

  currentRow++;
  const totalCost = transferBookings.reduce((s, b) => s + (parseFloat(b.cost_price) || 0), 0);
  const totalSell = transferBookings.reduce((s, b) => s + (parseFloat(b.selling_price) || 0), 0);
  const totalProfit = totalSell - totalCost;

  worksheet.getCell(currentRow, 1).value = "Summary";
  worksheet.getCell(currentRow, 1).font = { bold: true };
  worksheet.getCell(currentRow, 1).alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getCell(currentRow, 1).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
  worksheet.mergeCells(`A${currentRow}:L${currentRow}`);

  worksheet.getCell(currentRow, 13).value = totalCost.toLocaleString();
  worksheet.getCell(currentRow, 14).value = totalSell.toLocaleString();
  worksheet.getCell(currentRow, 15).value = totalProfit.toLocaleString();

  [13, 14, 15].forEach((ci) => {
    const cell = worksheet.getCell(currentRow, ci);
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFED7AA" } };
    cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.font = { bold: true };
  });
};

// ===== Row Data Helpers (flat data from PHP API) =====

const prepareCombinedRowData = (booking, index) => {
  const customerName = `${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "No Name";
  const cost = parseFloat(booking.cost_price) || 0;
  const sell = parseFloat(booking.selling_price) || 0;
  const profit = sell - cost;
  const isTour = booking._type === "tour";

  return [
    index,
    isTour ? "Tour" : "Transfer",
    booking.agent_name || "No Agent",
    customerName,
    formatPax(booking),
    isTour ? booking.tour_pickup_time || "-" : booking.transfer_time || "-",
    isTour ? booking.tour_hotel || "-" : "-",
    isTour ? booking.tour_detail || "-" : "-",
    isTour ? "-" : booking.pickup_location || "-",
    isTour ? "-" : booking.drop_location || "-",
    isTour ? "-" : booking.transfer_flight || "-",
    isTour ? "-" : booking.transfer_ftime || "-",
    booking.send_to || "-",
    booking.note || "-",
    "",
    cost.toLocaleString(),
    sell.toLocaleString(),
    profit.toLocaleString(),
    booking.payment_note || "-",
  ];
};

const prepareTourRowData = (booking, index) => {
  const customerName = `${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "No Name";
  const cost = parseFloat(booking.cost_price) || 0;
  const sell = parseFloat(booking.selling_price) || 0;
  const profit = sell - cost;

  return [
    index,
    booking.agent_name || "No Agent",
    customerName,
    formatPax(booking),
    booking.tour_pickup_time || "-",
    booking.tour_hotel || "-",
    booking.tour_detail || "-",
    booking.send_to || "-",
    booking.note || "-",
    "",
    cost.toLocaleString(),
    sell.toLocaleString(),
    profit.toLocaleString(),
    booking.payment_note || "-",
  ];
};

const prepareTransferRowData = (booking, index) => {
  const customerName = `${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "No Name";
  const cost = parseFloat(booking.cost_price) || 0;
  const sell = parseFloat(booking.selling_price) || 0;
  const profit = sell - cost;

  return [
    index,
    booking.agent_name || "No Agent",
    customerName,
    formatPax(booking),
    booking.transfer_time || "-",
    booking.pickup_location || "-",
    booking.drop_location || "-",
    booking.transfer_flight || "-",
    booking.transfer_ftime || "-",
    booking.send_to || "-",
    booking.note || "-",
    "",
    cost.toLocaleString(),
    sell.toLocaleString(),
    profit.toLocaleString(),
    booking.payment_note || "-",
  ];
};
