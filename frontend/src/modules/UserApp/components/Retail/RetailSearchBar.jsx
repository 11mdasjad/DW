import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiFilter, FiCheck, FiShoppingBag, FiTruck, FiStar, FiZap } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const RETAIL_SEARCH_PLACEHOLDERS = [
  'Search "White Cotton Casual Shirts"...',
  'Search "Wireless Bluetooth Earbuds"...',
  'Search "Running Sports Shoes & Sneakers"...',
  'Search "Women Summer Floral Maxi Dress"...',
  'Search "Non-stick Kitchen Cookware Sets"...',
  'Search "Skincare Face Serum & Sunscreen"...',
  'Search "Smart Watches & Fitness Bands"...',
  'Search "Denim Jeans & Stylish Jackets"...',
];

const POPULAR_RETAIL_QUERIES = [
  { label: "Men's Shirts", query: "shirt", chip: "👕 Shirts" },
  { label: "Sneakers & Shoes", query: "shoes", chip: "👟 Footwear" },
  { label: "Dresses & Tops", query: "dress", chip: "👗 Dresses" },
  { label: "Bags & Wallets", query: "bag", chip: "👜 Bags" },
  { label: "Watches", query: "watch", chip: "⌚ Watches" },
  { label: "Kitchen & Home", query: "kitchen", chip: "🍳 Kitchen" },
];

const RETAIL_QUICK_FILTERS = [
  { id: "deals", label: "Hot Deals", filterKey: "deals", icon: "🔥" },
  { id: "top-rated", label: "4★+ Rated", filterKey: "minRating", filterVal: "4", icon: "⭐" },
  { id: "under-499", label: "Under ₹499", filterKey: "maxPrice", filterVal: "499", icon: "🏷️" },
  { id: "under-999", label: "Under ₹999", filterKey: "maxPrice", filterVal: "999", icon: "💎" },
  { id: "express", label: "Pan-India Express", filterKey: "express", icon: "🚚" },
];

const RetailSearchBar = ({ categories = [], initialQuery = "" }) => {
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
      setPlaceholderIndex((prev) => (prev + 1) % RETAIL_SEARCH_PLACEHOLDERS.length);
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
    if (cleanQuery) params.set("q", cleanQuery);
    if (selectedDept && selectedDept !== "all") params.set("category", selectedDept);

    if (activeFilters.includes("top-rated")) params.set("minRating", "4");
    if (activeFilters.includes("under-499")) params.set("maxPrice", "499");
    if (activeFilters.includes("under-999")) params.set("maxPrice", "999");
    if (activeFilters.includes("deals")) params.set("sort", "discount");

    setIsFocused(false);
    navigate(`/search?${params.toString()}`);
  };

  const handleQuickTagClick = (tagQuery) => {
    setQuery(tagQuery);
    const params = new URLSearchParams();
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
      {/* Search Input Bar with Gold/Amber B2C border glow */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center bg-white rounded-2xl border-2 border-amber-400 shadow-sm focus-within:border-amber-500 focus-within:shadow-amber-500/20 focus-within:ring-2 focus-within:ring-amber-400/40 transition-all overflow-hidden p-1 sm:p-1.5"
      >
        {/* Department Dropdown Selector */}
        <div className="relative border-r border-gray-200 hidden sm:flex items-center shrink-0">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="appearance-none bg-transparent pl-3 pr-7 py-2 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer max-w-[155px] truncate"
            aria-label="Select retail department"
          >
            <option value="all">All Categories</option>
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
          <FiSearch className="text-amber-500 text-base shrink-0 mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={RETAIL_SEARCH_PLACEHOLDERS[placeholderIndex]}
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
          className="shrink-0 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black font-extrabold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <FiSearch className="text-sm stroke-[2.5]" />
          <span className="hidden xs:inline">Search</span>
        </button>
      </form>

      {/* Quick B2C Filters Strip Below Search Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide py-2 mt-1">
        <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <FiFilter className="text-[10px] text-amber-500" /> Filters:
        </span>
        {RETAIL_QUICK_FILTERS.map((f) => {
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
              <span>Trending Retail Searches</span>
              <span className="text-[10px] font-bold text-amber-600">Consumer Store</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {POPULAR_RETAIL_QUERIES.map((item) => (
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
              <span>Press <strong className="text-gray-800 font-bold">Enter</strong> to browse matching products</span>
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

export default RetailSearchBar;
