import React, { useState, useRef, useEffect } from 'react';

const AutocompleteInput = ({ name, defaultValue = '', options = [], placeholder = '', className = '', onChange }) => {
  const [value, setValue] = useState(defaultValue);
  const [filtered, setFiltered] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
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

  const handleKeyDown = (e) => {
    if (!isOpen || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < filtered.length) {
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
      {isOpen && filtered.length > 0 && (
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
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
