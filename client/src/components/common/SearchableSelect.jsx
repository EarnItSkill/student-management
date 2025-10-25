import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  renderOption,
  error,
  label,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      renderOption(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, renderOption]);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="form-control" ref={dropdownRef}>
      <label className="label">
        <span className="label-text font-semibold">{label}</span>
        {required && <span className="label-text-alt text-error">*</span>}
      </label>

      <div className="relative">
        <div
          className={`input input-bordered w-full flex items-center justify-between cursor-pointer ${
            error ? "input-error" : ""
          } ${isOpen ? "border-primary" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={selectedOption ? "" : "text-gray-400"}>
            {selectedOption ? renderOption(selectedOption) : placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-base-100 border-2 border-primary rounded-lg shadow-xl max-h-80 overflow-hidden">
            {/* Search Input */}
            <div className="p-2 border-b sticky top-0 bg-base-100">
              <div className="input-group">
                <span className="bg-base-200 px-3">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Type to search..."
                  className="input input-sm input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-60">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No results found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-3 cursor-pointer hover:bg-primary hover:text-white transition-colors ${
                      option.value === value
                        ? "bg-primary/20 font-semibold"
                        : ""
                    } ${
                      option.disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      if (!option.disabled) {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchTerm("");
                      }
                    }}
                  >
                    {renderOption(option)}
                  </div>
                ))
              )}
            </div>

            {/* Results Count */}
            <div className="p-2 border-t bg-base-200 text-xs text-gray-400 text-center">
              {filteredOptions.length} result(s) found
            </div>
          </div>
        )}
      </div>

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default SearchableSelect;
