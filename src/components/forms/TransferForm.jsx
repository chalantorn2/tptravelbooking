import React, { memo } from 'react';
import { X, Car } from 'lucide-react';
import AutocompleteInput from '../ui/AutocompleteInput';
import { useInformation } from '../../contexts/InformationContext';

const TransferForm = memo(({ id, data, onRemove }) => {
  const { transferTypes, places, provinces, transferRecipients, drivers, vehicles, addNewInformation } = useInformation();
  const transferTypeOptions = transferTypes.map((t) => t.value);
  const placeOptions = places.map((p) => p.value);
  const provinceOptions = provinces.map((p) => p.value);
  const recipientOptions = transferRecipients.map((r) => r.value);
  const driverOptions = drivers.map((d) => d.value);
  const vehicleOptions = vehicles.map((v) => v.value);

  const handleAddNew = (category) => (value) => addNewInformation({ category, value });

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-colors';

  return (
    <div className="bg-white border border-teal-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 py-2.5 flex justify-between items-center">
        <span className="font-medium text-sm flex items-center gap-2">
          <Car size={16} />
          Transfer #{id}
        </span>
        <button type="button" onClick={() => onRemove(id)} className="p-1 rounded-full hover:bg-white/20">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Booking Ref</label>
            <input name={`transfer_${id}_booking_ref`} defaultValue={data?.booking_ref || ''} className={inputClass} placeholder="Booking Ref" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Transfer Date *</label>
            <input type="date" name={`transfer_${id}_date`} defaultValue={data?.transfer_date || ''} className={inputClass} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Pickup Time</label>
            <input name={`transfer_${id}_pickup_time`} defaultValue={data?.transfer_time || ''} className={inputClass} placeholder="e.g. 14:00" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Transfer Type</label>
            <AutocompleteInput
              name={`transfer_${id}_type`}
              defaultValue={data?.transfer_type || ''}
              options={transferTypeOptions}
              className={inputClass}
              placeholder="Transfer type"
              onAddNew={handleAddNew('transfer_type')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Send To</label>
            <AutocompleteInput
              name={`transfer_${id}_send_to`}
              defaultValue={data?.send_to || ''}
              options={recipientOptions}
              className={inputClass}
              placeholder="Send to"
              onAddNew={handleAddNew('transfer_recipient')}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Details</label>
          <textarea name={`transfer_${id}_detail`} defaultValue={data?.transfer_detail || ''} className={inputClass} rows={2} placeholder="Transfer details" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Pickup Location</label>
            <AutocompleteInput
              name={`transfer_${id}_pickup_location`}
              defaultValue={data?.pickup_location || ''}
              options={placeOptions}
              className={inputClass}
              placeholder="Pickup location"
              onAddNew={handleAddNew('place')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Drop Location</label>
            <AutocompleteInput
              name={`transfer_${id}_drop_location`}
              defaultValue={data?.drop_location || ''}
              options={placeOptions}
              className={inputClass}
              placeholder="Drop location"
              onAddNew={handleAddNew('place')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Flight</label>
            <input name={`transfer_${id}_flight`} defaultValue={data?.transfer_flight || ''} className={inputClass} placeholder="Flight no." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Flight Time</label>
            <input name={`transfer_${id}_ftime`} defaultValue={data?.transfer_ftime || ''} className={inputClass} placeholder="Flight time" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Driver</label>
            <AutocompleteInput
              name={`transfer_${id}_driver`}
              defaultValue={data?.driver || ''}
              options={driverOptions}
              className={inputClass}
              placeholder="Driver name"
              onAddNew={handleAddNew('driver')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Car</label>
            <AutocompleteInput
              name={`transfer_${id}_car`}
              defaultValue={data?.car || ''}
              options={vehicleOptions}
              className={inputClass}
              placeholder="Car"
              onAddNew={handleAddNew('vehicle')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
            <input name={`transfer_${id}_phone_number`} defaultValue={data?.phone_number || ''} className={inputClass} placeholder="Phone number" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Province</label>
            <AutocompleteInput
              name={`transfer_${id}_province`}
              defaultValue={data?.province || ''}
              options={provinceOptions}
              className={inputClass}
              placeholder="Province"
              onAddNew={handleAddNew('province')}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Note</label>
          <input name={`transfer_${id}_note`} defaultValue={data?.note || ''} className={inputClass} placeholder="Note" />
        </div>
      </div>
    </div>
  );
});

TransferForm.displayName = 'TransferForm';
export default TransferForm;
