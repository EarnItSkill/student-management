import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

// A generic searchable select component
const SearchableSelect = ({
  options, // Array of { value, label, data } objects
  value, // The currently selected value
  onChange, // Function to call when a new option is selected
  placeholder = "Select an option",
  renderOption, // Function to render the label of an option
  error, // Error message string
  label, // Main label for the form control
  required = false,
  // Add other standard <select> props if needed (e.g., disabled)
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);

  // Find the currently selected option to display in the header
  const selectedOption = options.find((option) => option.value === value);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;

    const lowerCaseSearch = searchTerm.toLowerCase();

    return options.filter((option) => {
      // Use the rendered label for searching
      const optionLabel = renderOption ? renderOption(option) : option.label;
      return optionLabel.toLowerCase().includes(lowerCaseSearch);
    });
  }, [options, searchTerm, renderOption]);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm(""); // Clear search term after selection
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange(""); // Set value to empty string
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="form-control w-full" ref={selectRef}>
      {label && (
        <label className="label">
          <span className="label-text font-semibold">{label}</span>
          {required && <span className="label-text-alt text-error">*</span>}
        </label>
      )}

      {/* Select Header/Button */}
      <div
        tabIndex={0}
        role="button"
        className={`input input-bordered flex items-center justify-between cursor-pointer ${
          isOpen ? "ring ring-primary ring-offset-2" : ""
        } ${error ? "input-error" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className={selectedOption ? "text-base" : "text-gray-500"}>
          {selectedOption
            ? renderOption
              ? renderOption(selectedOption)
              : selectedOption.label
            : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {selectedOption && (
            <button
              type="button"
              className="btn btn-xs btn-ghost btn-circle"
              onClick={clearSelection}
              aria-label="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-xl w-full max-h-60 overflow-y-auto">
          {/* Search Input */}
          <div className="p-2 sticky top-0 bg-base-100 border-b z-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="input input-sm input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <ul className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`px-4 py-2 cursor-pointer hover:bg-base-200 ${
                    option.value === value ? "bg-primary/20 font-medium" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                >
                  {renderOption ? renderOption(option) : option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">
                No matching options found.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
