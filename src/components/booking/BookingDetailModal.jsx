import React, { useState, useEffect } from "react";
import { X, Save, Trash2, User, Plus, DollarSign } from "lucide-react";
import {
  updateTourBooking,
  updateTransferBooking,
  deleteTourBooking,
  deleteTransferBooking,
  fetchBookingFinances,
  createBookingFinance,
  updateBookingFinance,
  deleteBookingFinance,
} from "../../services/bookingService";
import { notify } from "../ui/Notification";
import AutocompleteInput from "../ui/AutocompleteInput";
import { useInformation } from "../../contexts/InformationContext";

const BookingDetailModal = ({ booking, bookingType, onClose, onRefresh }) => {
  const {
    tourTypes,
    transferTypes,
    places,
    provinces,
    tourRecipients,
    transferRecipients,
    drivers,
    vehicles,
  } = useInformation();
  const [formData, setFormData] = useState({});
  const [finances, setFinances] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({ ...booking });
      loadFinances();
    }
  }, [booking]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const loadFinances = async () => {
    if (!booking?.id) return;
    const { finances: data } = await fetchBookingFinances(
      bookingType,
      booking.id,
    );
    setFinances(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutoChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinanceChange = (index, field, value) => {
    const updated = [...finances];
    updated[index] = { ...updated[index], [field]: value };
    setFinances(updated);
  };

  const addFinanceRow = () => {
    setFinances([
      ...finances,
      {
        id: null,
        booking_type: bookingType,
        booking_item_id: booking.id,
        cost: 0,
        sell: 0,
        type: "all",
        remark: "",
      },
    ]);
  };

  const removeFinanceRow = async (index) => {
    const row = finances[index];
    if (row.id) {
      await deleteBookingFinance(row.id);
    }
    setFinances(finances.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updateFn =
        bookingType === "tour" ? updateTourBooking : updateTransferBooking;
      const { success, error } = await updateFn(formData.id, formData);
      if (!success) throw new Error(error);

      // Save finances
      for (const row of finances) {
        if (row.id) {
          await updateBookingFinance(row.id, {
            cost: row.cost,
            sell: row.sell,
            type: row.type,
            remark: row.remark,
          });
        } else {
          await createBookingFinance({
            booking_type: bookingType,
            booking_item_id: booking.id,
            cost: row.cost,
            sell: row.sell,
            type: row.type,
            remark: row.remark,
          });
        }
      }

      notify.success("Saved successfully");
      onRefresh();
      setTimeout(onClose, 800);
    } catch (err) {
      notify.error(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    setIsSubmitting(true);
    try {
      const deleteFn =
        bookingType === "tour" ? deleteTourBooking : deleteTransferBooking;
      const { success, error } = await deleteFn(booking.id);
      if (!success) throw new Error(error);
      notify.success("Deleted successfully");
      onRefresh();
      onClose();
    } catch (err) {
      notify.error(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTour = bookingType === "tour";
  const statusOptions = [
    "pending",
    "booked",
    "in_progress",
    "completed",
    "cancelled",
  ];

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors";

  const totalCost = finances.reduce(
    (sum, r) => sum + (parseFloat(r.cost) || 0),
    0,
  );
  const totalSell = finances.reduce(
    (sum, r) => sum + (parseFloat(r.sell) || 0),
    0,
  );
  const totalProfit = totalSell - totalCost;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex justify-between items-center text-white rounded-t-2xl ${isTour ? "bg-orange-600" : "bg-teal-600"}`}
        >
          <span className="text-lg font-semibold">
            {bookingType === "tour" ? "Tour" : "Transfer"} Booking Details
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Booking Info (read-only) */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1.5">
              <User size={16} /> Booking Information
            </h4>
            <div className="grid grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-400 text-xs">Customer</span>
                <p className="font-medium text-gray-700">
                  {booking.first_name} {booking.last_name}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Agent</span>
                <p className="font-medium text-gray-700">
                  {booking.agent_name || "-"}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Pax</span>
                <p className="font-medium text-gray-700">
                  {[
                    booking.booking_pax_adt > 0 &&
                      `${booking.booking_pax_adt} ADT`,
                    booking.booking_pax_chd > 0 &&
                      `${booking.booking_pax_chd} CHD`,
                    booking.booking_pax_inf > 0 &&
                      `${booking.booking_pax_inf} INF`,
                  ]
                    .filter(Boolean)
                    .join(", ") || "0"}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-xs">Ref ID</span>
                <p className="font-medium text-gray-700">
                  {booking.reference_id || `#${booking.id}`}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Ref & Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Booking Ref
              </label>
              <input
                name="booking_ref"
                value={formData.booking_ref || ""}
                onChange={handleChange}
                className={inputClass}
                placeholder="Booking Ref"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status || "pending"}
                onChange={handleChange}
                className={inputClass}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {{
                      pending: "รอดำเนินการ",
                      booked: "จองแล้ว",
                      in_progress: "กำลังดำเนินการ",
                      completed: "เสร็จสิ้น",
                      cancelled: "ยกเลิก",
                    }[s] || s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                {bookingType === "tour" ? "Tour Date" : "Transfer Date"}
              </label>
              <input
                type="date"
                name={bookingType === "tour" ? "tour_date" : "transfer_date"}
                value={
                  formData[
                    bookingType === "tour" ? "tour_date" : "transfer_date"
                  ] || ""
                }
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Type-specific fields */}
          {bookingType === "tour" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Pickup Time
                  </label>
                  <input
                    name="tour_pickup_time"
                    value={formData.tour_pickup_time || ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. 08:00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Tour Type
                  </label>
                  <AutocompleteInput
                    name="tour_type"
                    defaultValue={formData.tour_type || ""}
                    options={tourTypes.map((t) => t.value)}
                    onChange={handleAutoChange}
                    className={inputClass}
                    placeholder="Tour type"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Details
                </label>
                <textarea
                  name="tour_detail"
                  value={formData.tour_detail || ""}
                  onChange={handleChange}
                  className={inputClass}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Hotel
                  </label>
                  <AutocompleteInput
                    name="tour_hotel"
                    defaultValue={formData.tour_hotel || ""}
                    options={places.map((p) => p.value)}
                    onChange={handleAutoChange}
                    className={inputClass}
                    placeholder="Hotel name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Room No.
                  </label>
                  <input
                    name="tour_room_no"
                    value={formData.tour_room_no || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Send To
                  </label>
                  <AutocompleteInput
                    name="send_to"
                    defaultValue={formData.send_to || ""}
                    options={tourRecipients.map((r) => r.value)}
                    onChange={handleAutoChange}
                    className={inputClass}
                    placeholder="Send to"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Contact No.
                  </label>
                  <input
                    name="tour_contact_no"
                    value={formData.tour_contact_no || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Province
                  </label>
                  <AutocompleteInput
                    name="province"
                    defaultValue={formData.province || ""}
                    options={provinces.map((p) => p.value)}
                    onChange={handleAutoChange}
                    className={inputClass}
                    placeholder="Province"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Pickup Time
                  </label>
                  <input
                    name="transfer_time"
                    value={formData.transfer_time || ""}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="e.g. 14:00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Transfer Type
                  </label>
                  <AutocompleteInput
                    name="transfer_type"
                    defaultValue={formData.transfer_type || ""}
                    options={transferTypes.map((t) => t.value)}
                    onChange={handleAutoChange}
                    className={inputClass}
                    placeholder="Transfer type"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Pickup Location
                  </label>
                  <AutocompleteInput
                    name="pickup_location"
                    defaultValue={formData.pickup_location || ""}
                    options={places.map((p) => p.value)}
                    onChange={handleAutoChange}
                    className={inputClass}
                    placeholder="Pickup location"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Drop Location
                  </label>
                  <AutocompleteInput
                    name="drop_location"
                    defaultValue={formData.drop_location || ""}
                    options={places.map((p) => p.value)}
                    onChange={handleAutoChange}
                    className={inputClass}
                    placeholder="Drop location"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Flight
                  </label>
                  <input
                    name="transfer_flight"
                    value={formData.transfer_flight || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Flight Time
                  </label>
                  <input
                    name="transfer_ftime"
                    value={formData.transfer_ftime || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Send To
                  </label>
                  <AutocompleteInput
                    name="send_to"
                    defaultValue={formData.send_to || ""}
                    options={transferRecipients.map((r) => r.value)}
                    onChange={handleAutoChange}
                    className={inputClass}
                    placeholder="Send to"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Car Model
                  </label>
                  <AutocompleteInput
                    name="car_model"
                    defaultValue={formData.car_model || ""}
                    options={vehicles.map((v) => v.value)}
                    onChange={handleAutoChange}
                    className={inputClass}
                    placeholder="Car model"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <input
                    name="phone_number"
                    value={formData.phone_number || ""}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Province
                  </label>
                  <AutocompleteInput
                    name="province"
                    defaultValue={formData.province || ""}
                    options={provinces.map((p) => p.value)}
                    onChange={handleAutoChange}
                    className={inputClass}
                    placeholder="Province"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Notes
            </label>
            <textarea
              name="note"
              value={formData.note || ""}
              onChange={handleChange}
              className={inputClass}
              rows={2}
            />
          </div>

          {/* Finances */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                <DollarSign size={16} /> Payment
              </h4>
              <button
                type="button"
                onClick={addFinanceRow}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isTour ? "text-orange-600 bg-orange-50 hover:bg-orange-100" : "text-teal-600 bg-teal-50 hover:bg-teal-100"}`}
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {finances.length > 0 ? (
              <div className="p-4 space-y-3">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-400 px-1">
                  <div className="col-span-3">Cost</div>
                  <div className="col-span-3">Sell</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-3">Remark</div>
                  <div className="col-span-1"></div>
                </div>

                {finances.map((row, index) => (
                  <div
                    key={row.id || `new-${index}`}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={row.cost || 0}
                        onChange={(e) =>
                          handleFinanceChange(index, "cost", e.target.value)
                        }
                        className={inputClass}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={row.sell || 0}
                        onChange={(e) =>
                          handleFinanceChange(index, "sell", e.target.value)
                        }
                        className={inputClass}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={row.type || "all"}
                        onChange={(e) =>
                          handleFinanceChange(index, "type", e.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="all">All</option>
                        <option value="adt">ADT</option>
                        <option value="chd">CHD</option>
                      </select>
                    </div>
                    <div className="col-span-3">
                      <input
                        value={row.remark || ""}
                        onChange={(e) =>
                          handleFinanceChange(index, "remark", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Remark"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeFinanceRow(index)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Totals */}
                <div className="grid grid-cols-12 gap-2 pt-3 border-t border-gray-200 text-sm font-medium">
                  <div className="col-span-3 text-gray-600 px-1">
                    Total:{" "}
                    <span className="text-red-500">
                      {totalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-3 text-gray-600 px-1">
                    Total:{" "}
                    <span className="text-green-600">
                      {totalSell.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-6 text-right text-gray-600 px-1">
                    Profit:{" "}
                    <span
                      className={
                        totalProfit >= 0 ? "text-green-600" : "text-red-500"
                      }
                    >
                      {totalProfit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-gray-400">
                No finance data yet. Click "Add" to add a row.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-1.5 px-5 py-2 text-sm text-white rounded-lg transition-colors disabled:opacity-50 ${isTour ? "bg-orange-600 hover:bg-orange-700" : "bg-teal-600 hover:bg-teal-700"}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save size={16} /> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingDetailModal;
