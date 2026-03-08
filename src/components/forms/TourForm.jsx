import React, { memo } from "react";
import { X, Camera } from "lucide-react";
import AutocompleteInput from "../ui/AutocompleteInput";
import { useInformation } from "../../contexts/InformationContext";

const TourForm = memo(({ id, data, onRemove }) => {
  const { tourTypes, places, provinces, tourRecipients } = useInformation();
  const tourTypeOptions = tourTypes.map((t) => t.value);
  const placeOptions = places.map((p) => p.value);
  const provinceOptions = provinces.map((p) => p.value);
  const recipientOptions = tourRecipients.map((r) => r.value);

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400 transition-colors";

  return (
    <div className="bg-white border border-cyan-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-4 py-2.5 flex justify-between items-center">
        <span className="font-medium text-sm flex items-center gap-2">
          <Camera size={16} />
          Tour #{id}
        </span>
        <button
          type="button"
          onClick={() => onRemove(id)}
          className="p-1 rounded-full hover:bg-white/20"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Tour Date *
            </label>
            <input
              type="date"
              name={`tour_${id}_date`}
              defaultValue={data?.tour_date || ""}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Pickup Time
            </label>
            <input
              name={`tour_${id}_pickup_time`}
              defaultValue={data?.tour_pickup_time || ""}
              className={inputClass}
              placeholder="e.g. 08:00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Tour Type
            </label>
            <AutocompleteInput
              name={`tour_${id}_type`}
              defaultValue={data?.tour_type || ""}
              options={tourTypeOptions}
              className={inputClass}
              placeholder="Tour type"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Send To
            </label>
            <AutocompleteInput
              name={`tour_${id}_send_to`}
              defaultValue={data?.send_to || ""}
              options={recipientOptions}
              className={inputClass}
              placeholder="Send to"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Details
          </label>
          <textarea
            name={`tour_${id}_detail`}
            defaultValue={data?.tour_detail || ""}
            className={inputClass}
            rows={2}
            placeholder="Tour details"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Hotel
            </label>
            <AutocompleteInput
              name={`tour_${id}_hotel`}
              defaultValue={data?.tour_hotel || ""}
              options={placeOptions}
              className={inputClass}
              placeholder="Hotel name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Room No.
            </label>
            <input
              name={`tour_${id}_room_no`}
              defaultValue={data?.tour_room_no || ""}
              className={inputClass}
              placeholder="Room number"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Contact No.
            </label>
            <input
              name={`tour_${id}_contact_no`}
              defaultValue={data?.tour_contact_no || ""}
              className={inputClass}
              placeholder="Contact number"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Province
            </label>
            <AutocompleteInput
              name={`tour_${id}_province`}
              defaultValue={data?.province || ""}
              options={provinceOptions}
              className={inputClass}
              placeholder="Province"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Note
          </label>
          <input
            name={`tour_${id}_note`}
            defaultValue={data?.note || ""}
            className={inputClass}
            placeholder="Note"
          />
        </div>
      </div>
    </div>
  );
});

TourForm.displayName = "TourForm";
export default TourForm;
