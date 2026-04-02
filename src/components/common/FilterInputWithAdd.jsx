import React, { useState } from "react";
import { Plus } from "lucide-react";
import AutocompleteInput from "../ui/AutocompleteInput";

const FilterInputWithAdd = ({
  options = [],
  value = "",
  onChange,
  onAdd,
  placeholder = "",
  selectedItems = [],
  disabled = false,
  name,
}) => {
  const [currentInputValue, setCurrentInputValue] = useState("");

  const handleInputChange = (_name, newValue) => {
    setCurrentInputValue(newValue);
    onChange(newValue);
  };

  const handleAddClick = () => {
    if (!currentInputValue.trim()) return;

    const alreadySelected = selectedItems.some(
      (item) => item.toLowerCase() === currentInputValue.toLowerCase()
    );

    if (alreadySelected) return;

    onAdd(currentInputValue);
    setCurrentInputValue("");
    onChange("");
  };

  const shouldShowAddButton = currentInputValue.trim() && !disabled;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <AutocompleteInput
          options={options}
          defaultValue={currentInputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          name={name}
          className={`w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        />
      </div>

      {shouldShowAddButton && (
        <button
          type="button"
          onClick={handleAddClick}
          className="flex items-center px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
        >
          <Plus size={16} className="mr-1" />
          Add
        </button>
      )}
    </div>
  );
};

export default FilterInputWithAdd;
