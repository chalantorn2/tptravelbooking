import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';

const AutocompleteInput = ({ name, defaultValue = '', options = [], placeholder = '', className = '', onChange, onAddNew }) => {
  const [value, setValue] = useState(defaultValue);
  const [filtered, setFiltered] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [adding, setAdding] = useState(false);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightIndex];
      if (item) item.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIndex]);

  const handleChange = (e) => {
    const input = e.target.value;
    setValue(input);
    onChange?.(name, input);

    if (input.trim() === '') {
      setFiltered(options);
    } else {
      const lower = input.toLowerCase();
      setFiltered(options.filter((opt) => opt.toLowerCase().includes(lower)));
    }
    setIsOpen(true);
    setHighlightIndex(-1);
  };

  const handleFocus = () => {
    if (value.trim() === '') {
      setFiltered(options);
    } else {
      const lower = value.toLowerCase();
      setFiltered(options.filter((opt) => opt.toLowerCase().includes(lower)));
    }
    setIsOpen(true);
  };

  const handleSelect = (opt) => {
    setValue(opt);
    onChange?.(name, opt);
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const trimmedValue = value.trim();
  const hasExactMatch = trimmedValue !== '' && options.some((opt) => opt.toLowerCase() === trimmedValue.toLowerCase());
  const showAddNew = onAddNew && trimmedValue !== '' && !hasExactMatch;

  const totalItems = filtered.length + (showAddNew ? 1 : 0);
  const addNewIndex = showAddNew ? filtered.length : -1;

  const handleAddNew = async () => {
    if (adding || !trimmedValue) return;
    setAdding(true);
    try {
      await onAddNew(trimmedValue);
      setValue(trimmedValue);
      onChange?.(name, trimmedValue);
      setIsOpen(false);
    } finally {
      setAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || totalItems === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex === addNewIndex) {
        handleAddNew();
      } else if (highlightIndex >= 0 && highlightIndex < filtered.length) {
        handleSelect(filtered[highlightIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {isOpen && totalItems > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {filtered.map((opt, i) => (
            <li
              key={opt}
              onMouseDown={() => handleSelect(opt)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                i === highlightIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              {opt}
            </li>
          ))}
          {showAddNew && (
            <li
              onMouseDown={handleAddNew}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors border-t border-gray-100 flex items-center gap-1.5 ${
                highlightIndex === addNewIndex
                  ? 'bg-green-50 text-green-700'
                  : 'hover:bg-green-50 text-green-600'
              }`}
            >
              <Plus size={14} />
              {adding ? 'กำลังเพิ่ม...' : `เพิ่ม "${trimmedValue}"`}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
