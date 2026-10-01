import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiFilter, FiCheck, FiLayers, FiTruck, FiFileText } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SEARCH_PLACEHOLDERS = [
  'Search "Cotton Shirts 500 pcs lot"...',
  'Search "Formal Shoes bulk packaging"...',
  'Search "Packaging & corrugated boxes"...',
  'Search "Pure spices & dry fruits lots"...',
  'Search "Casual sneakers & loafers MOQ 20"...',
  'Search "Fabrics & textile raw materials"...',
  'Search "Stainless steel cookware bulk"...',
];

const POPULAR_WHOLESALE_QUERIES = [
  { label: "Apparel Lots", query: "shirts", chip: "👕 Apparel" },
  { label: "Footwear Bulk", query: "shoes", chip: "👟 Footwear" },
  { label: "Bags & Luggage", query: "bag", chip: "🎒 Bags" },
  { label: "Packaging Boxes", query: "packaging", chip: "📦 Packaging" },
  { label: "Home & Bedding", query: "home", chip: "🏠 Home" },
];

const QUICK_FILTERS = [
  { id: "moq", label: "Low MOQ (≤ 20)", filterKey: "hasMoq", filterVal: "true", icon: "📦" },
  { id: "tiered", label: "Volume Slabs", filterKey: "bulkDiscount", filterVal: "true", icon: "📊" },
  { id: "gst", label: "GST Tax Invoice", filterKey: "gst", filterVal: "true", icon: "📑" },
  { id: "cargo", label: "Doorstep Cargo", filterKey: "cargo", filterVal: "true", icon: "🚚" },
  { id: "factory", label: "Factory Direct", filterKey: "factory", filterVal: "true", icon: "🏭" },
];

const WholesaleSearchBar = ({ categories = [], initialQuery = "" }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [selectedDept, setSelectedDept] = useState("all");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const wrapperRef = useRef(null);

  // Rotate search placeholder every 3 seconds if query is empty
  useEffect(() => {
    if (query.trim()) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [query]);

  // Click outside listener for suggestions popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanQuery = query.trim();
    const params = new URLSearchParams();
    params.set("experience", "wholesale");
    params.set("delivery", "wholesale");
    if (cleanQuery) params.set("q", cleanQuery);
    if (selectedDept && selectedDept !== "all") params.set("category", selectedDept);

    if (activeFilters.includes("moq")) params.set("hasMoq", "true");
    if (activeFilters.includes("tiered")) params.set("bulkDiscount", "true");

    setIsFocused(false);
    navigate(`/search?${params.toString()}`);
  };

  const handleQuickTagClick = (tagQuery) => {
    setQuery(tagQuery);
    const params = new URLSearchParams();
    params.set("experience", "wholesale");
    params.set("delivery", "wholesale");
    params.set("q", tagQuery);
    if (selectedDept && selectedDept !== "all") params.set("category", selectedDept);
    setIsFocused(false);
    navigate(`/search?${params.toString()}`);
  };

  const toggleFilter = (filterId) => {
    setActiveFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  return (
    <div ref={wrapperRef} className="w-full relative">
      {/* Search Input Bar with Gold/Amber B2B border glow */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center bg-white rounded-2xl border-2 border-amber-400/80 shadow-md focus-within:border-amber-500 focus-within:shadow-amber-500/20 focus-within:ring-2 focus-within:ring-amber-400/40 transition-all overflow-hidden p-1 sm:p-1.5"
      >
        {/* Department Dropdown Selector */}
        <div className="relative border-r border-gray-200 hidden sm:flex items-center shrink-0">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="appearance-none bg-transparent pl-3 pr-7 py-2 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer max-w-[150px] truncate"
            aria-label="Select wholesale department"
          >
            <option value="all">All Departments</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none text-gray-400">
            ▼
          </span>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 flex items-center min-w-0 pl-3">
          <FiSearch className="text-amber-600 text-base shrink-0 mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
            className="w-full py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-900 bg-transparent placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors mr-1 cursor-pointer"
              aria-label="Clear search"
            >
              <FiX className="text-xs sm:text-sm" />
            </button>
          )}
        </div>

        {/* Submit Search Button */}
        <button
          type="submit"
          className="shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <FiSearch className="text-sm stroke-[2.5]" />
          <span className="hidden xs:inline">Search Bulk</span>
        </button>
      </form>

      {/* Quick B2B Filters Strip Below Search Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide py-2 mt-1">
        <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <FiFilter className="text-[10px] text-amber-500" /> Sourcing Filters:
        </span>
        {QUICK_FILTERS.map((f) => {
          const isActive = activeFilters.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => toggleFilter(f.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold shrink-0 transition-all flex items-center gap-1 cursor-pointer border ${
                isActive
                  ? "bg-amber-400 text-black border-amber-500 shadow-xs"
                  : "bg-surface-card text-textColor-secondary border-borderToken-default hover:border-amber-400 hover:text-textColor-primary"
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
              {isActive && <FiCheck className="text-[10px] stroke-[3]" />}
            </button>
          );
        })}
      </div>

      {/* Autocomplete / Popular Searches Dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 p-3 sm:p-4 text-left"
          >
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Popular Wholesale Sourcing Searches</span>
              <span className="text-[10px] font-semibold text-amber-600">B2B Direct</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {POPULAR_WHOLESALE_QUERIES.map((item) => (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => handleQuickTagClick(item.query)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-amber-400/20 hover:text-amber-800 text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{item.chip}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>Press <strong className="text-gray-800 font-bold">Enter</strong> to search with all selected filters</span>
              <button
                type="button"
                onClick={() => setIsFocused(false)}
                className="text-amber-600 font-bold hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WholesaleSearchBar;
