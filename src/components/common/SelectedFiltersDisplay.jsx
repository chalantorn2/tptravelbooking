import React from "react";
import { X } from "lucide-react";

const SelectedFiltersDisplay = ({
  selectedAgents = [],
  selectedTourRecipients = [],
  selectedTransferRecipients = [],
  onRemove,
}) => {
  const hasFilters =
    selectedAgents.length > 0 ||
    selectedTourRecipients.length > 0 ||
    selectedTransferRecipients.length > 0;

  if (!hasFilters) return null;

  const renderFilterGroup = (items, type, label, color) => {
    if (items.length === 0) return null;

    const bgClass = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      purple: "bg-purple-100 text-purple-800",
    }[color];

    const btnClass = {
      blue: "bg-blue-200 hover:bg-blue-300",
      green: "bg-green-200 hover:bg-green-300",
      purple: "bg-purple-200 hover:bg-purple-300",
    }[color];

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">{label}:</span>
        <div className="flex items-center gap-1 flex-wrap">
          {items.map((item, index) => (
            <span
              key={`${type}-${index}`}
              className={`inline-flex items-center gap-1 px-2 py-1 ${bgClass} text-sm rounded-full`}
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(type, item)}
                className={`flex items-center justify-center w-4 h-4 ${btnClass} rounded-full transition-colors`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex items-center gap-6 flex-wrap">
        <span className="text-sm font-semibold text-gray-700">
          Selected Filters:
        </span>
        {renderFilterGroup(selectedAgents, "agent", "Agent", "blue")}
        {renderFilterGroup(selectedTourRecipients, "tour_recipient", "Tour Recipient", "green")}
        {renderFilterGroup(selectedTransferRecipients, "transfer_recipient", "Transfer Recipient", "purple")}
      </div>
    </div>
  );
};

export default SelectedFiltersDisplay;
