import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiCamera, FiChevronDown, FiZap, FiBox, FiCheckCircle } from "react-icons/fi";

const TRENDING_KEYWORDS = [
  "Cotton T-Shirts",
  "Smart Watches",
  "TWS Earbuds",
  "Packaging Cartons",
  "Stainless Cookware",
  "Leather Boots",
  "Running Shoes",
  "Direct Mill Lots",
];

const SEARCH_TABS = [
  { id: "products", label: "Products", icon: "📦" },
  { id: "manufacturers", label: "Manufacturers", icon: "🏭" },
  { id: "ready-to-ship", label: "Ready to Ship", icon: "⚡" },
];

/**
 * AlibabaMainSearchBar
 *
 * Alibaba.com signature top sourcing search bar:
 * - Search Mode Tabs: Products | Manufacturers | Ready to Ship
 * - Department Selector dropdown
 * - Large search input with orange/amber Search CTA
 * - Trending keyword tags underneath
 */
const AlibabaMainSearchBar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      navigate("/shop");
      return;
    }

    let url = `/search?q=${encodeURIComponent(trimmed)}`;
    if (activeTab === "manufacturers") {
      url += "&mode=suppliers&experience=wholesale";
    } else if (activeTab === "ready-to-ship") {
      url += "&filter=ready-to-ship&experience=wholesale";
    }
    if (category !== "all") {
      url += `&category=${category}`;
    }
    navigate(url);
  };

  const handleKeywordClick = (kw) => {
    setQuery(kw);
    navigate(`/search?q=${encodeURIComponent(kw)}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-1">
      {/* ── Search Mode Tabs (Alibaba style) ── */}
      <div className="flex items-center gap-2 mb-2">
        {SEARCH_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-t-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-amber-500 text-black shadow-xs border-t-2 border-black"
                : "bg-surface-card hover:bg-borderToken-light text-textColor-secondary border border-borderToken-default"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Main Search Input Bar ── */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-surface-card rounded-2xl border-2 border-amber-500 shadow-md overflow-hidden"
      >
        {/* Department Selector Dropdown */}
        <div className="hidden sm:flex items-center gap-1 px-3.5 py-3 border-r border-borderToken-default bg-surface-background/50 shrink-0">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent text-xs font-bold text-textColor-primary focus:outline-none cursor-pointer pr-1"
          >
            <option value="all">All Categories</option>
            <option value="clothing">Apparel & Textiles</option>
            <option value="electronics">Electronics & Gadgets</option>
            <option value="home">Home & Kitchen</option>
            <option value="packaging">Packaging & Shipping</option>
            <option value="footwear">Footwear & Bags</option>
            <option value="beauty">Beauty & Personal Care</option>
          </select>
        </div>

        {/* Text Input */}
        <div className="flex-1 flex items-center px-4 py-2">
          <FiSearch className="text-amber-500 text-lg mr-2.5 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              activeTab === "manufacturers"
                ? "Search verified mills, manufacturers, audited factories..."
                : activeTab === "ready-to-ship"
                ? "Search ready-to-ship lots, low MOQ items, instant dispatch..."
                : "Search products, bulk wholesale lots, global suppliers..."
            }
            className="w-full bg-transparent text-xs sm:text-sm text-textColor-primary placeholder:text-textColor-muted focus:outline-none font-medium"
          />
        </div>

        {/* Alibaba Search Button */}
        <button
          type="submit"
          className="px-6 sm:px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <FiSearch className="text-sm font-black" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* ── Popular / Trending Keywords Row ── */}
      <div className="flex items-center gap-2 mt-2 overflow-x-auto scrollbar-hide py-1">
        <span className="text-[10px] font-black uppercase text-textColor-muted shrink-0">
          Popular:
        </span>
        {TRENDING_KEYWORDS.map((kw, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleKeywordClick(kw)}
            className="text-[11px] font-medium text-textColor-secondary hover:text-amber-600 hover:underline shrink-0 bg-surface-card px-2 py-0.5 rounded-md border border-borderToken-default/60 cursor-pointer transition-colors"
          >
            {kw}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlibabaMainSearchBar;
