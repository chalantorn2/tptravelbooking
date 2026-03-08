import React, { useState, useRef, useCallback } from "react";
import { Plus, Check } from "lucide-react";
import BookingSelector from "../components/forms/BookingSelector";
import TourForm from "../components/forms/TourForm";
import TransferForm from "../components/forms/TransferForm";
import BookingCounter from "../components/ui/BookingCounter";
import AutocompleteInput from "../components/ui/AutocompleteInput";
import { useInformation } from "../contexts/InformationContext";
import {
  createBooking,
  updateBooking,
  createTourBooking,
  createTransferBooking,
} from "../services/bookingService";
import { generateBookingID, generateSubBookingID } from "../utils/idGenerator";
import { notify } from "../components/ui/Notification";

const BookingForm = () => {
  const { agents } = useInformation();
  const agentOptions = agents.map((a) => a.value);
  const [currentBookingKey, setCurrentBookingKey] = useState(null);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [tourForms, setTourForms] = useState([]);
  const [transferForms, setTransferForms] = useState([]);
  const [bookingCounts, setBookingCounts] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const selectorRef = useRef(null);

  const [mainForm, setMainForm] = useState({
    agent: "",
    firstName: "",
    lastName: "",
    paxAdt: "0",
    paxChd: "0",
    paxInf: "0",
  });

  const handleBookingSelect = (bookingKey, bookingId, counts, bookingData) => {
    if (bookingKey) {
      setCurrentBookingKey(bookingKey);
      setCurrentBookingId(bookingId);
      setBookingCounts(counts);
      setIsFormVisible(true);
      setIsCreatingNew(false);
      if (bookingData) {
        setMainForm({
          agent: bookingData.agent_name || "",
          firstName: bookingData.first_name || "",
          lastName: bookingData.last_name || "",
          paxAdt: String(bookingData.pax_adt || 0),
          paxChd: String(bookingData.pax_chd || 0),
          paxInf: String(bookingData.pax_inf || 0),
        });
      }
    } else {
      resetForm();
    }
  };

  const handleCreateNew = () => {
    resetForm();
    setIsFormVisible(true);
    setIsCreatingNew(true);
  };

  const handleCancelCreate = () => {
    resetForm();
    setIsFormVisible(false);
    setIsCreatingNew(false);
  };

  const resetForm = () => {
    setMainForm({
      agent: "",
      firstName: "",
      lastName: "",
      paxAdt: "0",
      paxChd: "0",
      paxInf: "0",
    });
    setTourForms([]);
    setTransferForms([]);
    setCurrentBookingKey(null);
    setCurrentBookingId(null);
    setBookingCounts(null);
    setError("");
  };

  const handleMainChange = useCallback((e) => {
    setMainForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleAutocompleteChange = useCallback((name, value) => {
    setMainForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addTourForm = () => {
    const nextId =
      tourForms.length > 0 ? Math.max(...tourForms.map((f) => f.id)) + 1 : 1;
    setTourForms([...tourForms, { id: nextId }]);
  };

  const addTransferForm = () => {
    const nextId =
      transferForms.length > 0
        ? Math.max(...transferForms.map((f) => f.id)) + 1
        : 1;
    setTransferForms([...transferForms, { id: nextId }]);
  };

  const removeTourForm = useCallback(
    (id) => setTourForms((prev) => prev.filter((f) => f.id !== id)),
    [],
  );
  const removeTransferForm = useCallback(
    (id) => setTransferForms((prev) => prev.filter((f) => f.id !== id)),
    [],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!mainForm.agent) throw new Error("Please enter Agent name");
      if (tourForms.length === 0 && transferForms.length === 0)
        throw new Error("Please add at least 1 Tour or Transfer");

      const totalPax =
        (parseInt(mainForm.paxAdt) || 0) +
        (parseInt(mainForm.paxChd) || 0) +
        (parseInt(mainForm.paxInf) || 0);
      let bookingKey = currentBookingKey;

      if (!bookingKey) {
        const refId = await generateBookingID(mainForm.agent);
        const { data: newBooking, error: bookingError } = await createBooking({
          reference_id: refId,
          first_name: mainForm.firstName,
          last_name: mainForm.lastName,
          agent_name: mainForm.agent,
          pax: String(totalPax),
          pax_adt: parseInt(mainForm.paxAdt) || 0,
          pax_chd: parseInt(mainForm.paxChd) || 0,
          pax_inf: parseInt(mainForm.paxInf) || 0,
        });
        if (bookingError) throw new Error(bookingError);
        bookingKey = newBooking.id;
      } else {
        const { error: updateError } = await updateBooking(bookingKey, {
          first_name: mainForm.firstName,
          last_name: mainForm.lastName,
          agent_name: mainForm.agent,
          pax: String(totalPax),
          pax_adt: parseInt(mainForm.paxAdt) || 0,
          pax_chd: parseInt(mainForm.paxChd) || 0,
          pax_inf: parseInt(mainForm.paxInf) || 0,
        });
        if (updateError) throw new Error(updateError);
      }

      const formElements = document.forms[0].elements;
      const allDates = [];

      // Create tour bookings
      for (const tourForm of tourForms) {
        const fid = tourForm.id;
        const tourDate = formElements[`tour_${fid}_date`]?.value;
        if (!tourDate) throw new Error(`Tour #${fid}: Date is required`);
        allDates.push(tourDate);

        const refId = await generateSubBookingID("tour");
        const { error } = await createTourBooking({
          booking_id: Number(bookingKey),
          reference_id: refId,
          tour_date: tourDate,
          tour_pickup_time:
            formElements[`tour_${fid}_pickup_time`]?.value || null,
          tour_type: formElements[`tour_${fid}_type`]?.value || null,
          tour_detail: formElements[`tour_${fid}_detail`]?.value || null,
          tour_hotel: formElements[`tour_${fid}_hotel`]?.value || null,
          tour_room_no: formElements[`tour_${fid}_room_no`]?.value || null,
          tour_contact_no:
            formElements[`tour_${fid}_contact_no`]?.value || null,
          province: formElements[`tour_${fid}_province`]?.value || null,
          send_to: formElements[`tour_${fid}_send_to`]?.value || null,
          note: formElements[`tour_${fid}_note`]?.value || null,
          status: "pending",
        });
        if (error) throw new Error(error);
      }

      // Create transfer bookings
      for (const transferForm of transferForms) {
        const fid = transferForm.id;
        const transferDate = formElements[`transfer_${fid}_date`]?.value;
        if (!transferDate)
          throw new Error(`Transfer #${fid}: Date is required`);
        allDates.push(transferDate);

        const refId = await generateSubBookingID("transfer");
        const { error } = await createTransferBooking({
          booking_id: Number(bookingKey),
          reference_id: refId,
          transfer_date: transferDate,
          transfer_time:
            formElements[`transfer_${fid}_pickup_time`]?.value || null,
          transfer_type: formElements[`transfer_${fid}_type`]?.value || null,
          transfer_detail:
            formElements[`transfer_${fid}_detail`]?.value || null,
          pickup_location:
            formElements[`transfer_${fid}_pickup_location`]?.value || null,
          drop_location:
            formElements[`transfer_${fid}_drop_location`]?.value || null,
          transfer_flight:
            formElements[`transfer_${fid}_flight`]?.value || null,
          transfer_ftime: formElements[`transfer_${fid}_ftime`]?.value || null,
          car_model: formElements[`transfer_${fid}_car_model`]?.value || null,
          phone_number:
            formElements[`transfer_${fid}_phone_number`]?.value || null,
          province: formElements[`transfer_${fid}_province`]?.value || null,
          send_to: formElements[`transfer_${fid}_send_to`]?.value || null,
          note: formElements[`transfer_${fid}_note`]?.value || null,
          status: "pending",
        });
        if (error) throw new Error(error);
      }

      // Update dates on booking
      if (allDates.length > 0) {
        allDates.sort();
        await updateBooking(bookingKey, {
          start_date: allDates[0],
          end_date: allDates[allDates.length - 1],
        });
      }

      notify.success(
        `Saved! Tour: ${tourForms.length}, Transfer: ${transferForms.length}`,
      );
      setTimeout(() => {
        resetForm();
        setIsFormVisible(false);
        selectorRef.current?.refreshBookings();
      }, 1500);
    } catch (err) {
      setError(err.message);
      notify.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add Booking</h1>
        <p className="text-gray-400 text-sm mt-1">
          Select existing or create a new booking
        </p>
      </div>

      {/* Booking Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
          Select Booking
        </h2>
        <BookingSelector
          ref={selectorRef}
          onBookingSelect={handleBookingSelect}
          onCreateNew={handleCreateNew}
          isCreatingNew={isCreatingNew}
          selectedBookingId={currentBookingId}
          onCancelCreate={handleCancelCreate}
        />
      </div>

      {/* Main Form */}
      {isFormVisible && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 text-center">
            <h2 className="text-lg font-semibold">Main Booking Information</h2>
            {currentBookingId && (
              <p className="text-blue-200 text-sm mt-0.5">
                Ref: {currentBookingId}
              </p>
            )}
          </div>

          {bookingCounts && (
            <div className="bg-blue-50 p-2.5 border-b border-blue-100 text-center text-sm text-gray-600">
              This booking has{" "}
              <b className="text-cyan-600">{bookingCounts.tourCount} tour(s)</b>{" "}
              and{" "}
              <b className="text-teal-600">
                {bookingCounts.transferCount} transfer(s)
              </b>
            </div>
          )}

          <div className="p-5">
            <form onSubmit={handleSubmit}>
              {/* Agent & Pax */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Agent <span className="text-red-400">*</span>
                  </label>
                  <AutocompleteInput
                    name="agent"
                    defaultValue={mainForm.agent}
                    options={agentOptions}
                    className={inputClass}
                    placeholder="Agent name"
                    onChange={handleAutocompleteChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Adult (ADT) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="paxAdt"
                    value={mainForm.paxAdt}
                    onChange={handleMainChange}
                    className={`${inputClass} text-right`}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Child (CHD)
                  </label>
                  <input
                    type="number"
                    name="paxChd"
                    value={mainForm.paxChd}
                    onChange={handleMainChange}
                    className={`${inputClass} text-right`}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Infant (INF)
                  </label>
                  <input
                    type="number"
                    name="paxInf"
                    value={mainForm.paxInf}
                    onChange={handleMainChange}
                    className={`${inputClass} text-right`}
                    min="0"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={mainForm.firstName}
                    onChange={handleMainChange}
                    className={inputClass}
                    placeholder="Customer first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={mainForm.lastName}
                    onChange={handleMainChange}
                    className={inputClass}
                    placeholder="Customer last name"
                    required
                  />
                </div>
              </div>

              {/* Add Tour/Transfer Buttons */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  type="button"
                  onClick={addTourForm}
                  className="px-5 py-2 border-2 border-cyan-500 text-cyan-600 font-medium rounded-xl hover:bg-cyan-500 hover:text-white transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus size={18} /> Add Tour
                </button>
                <button
                  type="button"
                  onClick={addTransferForm}
                  className="px-5 py-2 border-2 border-teal-500 text-teal-600 font-medium rounded-xl hover:bg-teal-500 hover:text-white transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus size={18} /> Add Transfer
                </button>
              </div>

              {/* Forms */}
              {(tourForms.length > 0 || transferForms.length > 0) && (
                <>
                  <BookingCounter
                    tourCount={tourForms.length}
                    transferCount={transferForms.length}
                  />

                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      {tourForms.map((form) => (
                        <TourForm
                          key={form.id}
                          id={form.id}
                          data={form.data}
                          onRemove={removeTourForm}
                        />
                      ))}
                    </div>
                    <div className="space-y-4">
                      {transferForms.map((form) => (
                        <TransferForm
                          key={form.id}
                          id={form.id}
                          data={form.data}
                          onRemove={removeTransferForm}
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl my-4 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="text-center mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm flex items-center gap-2 mx-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check size={18} /> Save Booking
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
