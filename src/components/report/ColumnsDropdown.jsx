import React, { useState, useRef, useEffect } from "react";
import { Columns3, Check } from "lucide-react";

const ColumnsDropdown = ({ columns, visibleColumns, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleCount = Object.values(visibleColumns).filter(Boolean).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors shadow-sm ${
          isOpen
            ? "bg-blue-50 border-blue-300 text-blue-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        <Columns3 size={14} />
        Columns ({visibleCount})
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50 py-1 max-h-80 overflow-y-auto">
          {columns.map((col) => (
            <button
              key={col.key}
              onClick={() => onToggle(col.key)}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{col.label}</span>
              {visibleColumns[col.key] && (
                <Check size={14} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnsDropdown;
