import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiGrid, FiSearch, FiLayers, FiArrowRight, FiX, FiCheck } from "react-icons/fi";
import RetailCategoryCard from "./RetailCategoryCard";

/**
 * RetailCategoryShowcase
 *
 * Complete B2C Category Showcase component.
 * Displays all 25 root categories and their subcategories dynamically.
 * Includes category search, department filter pills, and a link to View All Categories.
 */
const RetailCategoryShowcase = ({ categories = [], getCategoriesByParent }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  // Filter root categories
  const rootCategories = useMemo(() => {
    return categories
      .filter((cat) => !cat.parentId && cat.isActive !== false)
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  }, [categories]);

  // Precompute subcategories mapping for each root category
  const subcategoryMap = useMemo(() => {
    const map = {};
    rootCategories.forEach((root) => {
      const rootId = root._id || root.id;
      if (typeof getCategoriesByParent === "function") {
        map[rootId] = getCategoriesByParent(rootId).filter((c) => c.isActive !== false);
      } else {
        map[rootId] = categories.filter((c) => {
          const parent = typeof c.parentId === "object" ? c.parentId?._id : c.parentId;
          return String(parent) === String(rootId) && c.isActive !== false;
        });
      }
    });
    return map;
  }, [rootCategories, categories, getCategoriesByParent]);

  // Filter by search query or department
  const filteredCategories = useMemo(() => {
    return rootCategories.filter((cat) => {
      const rootId = cat._id || cat.id;
      const subcats = subcategoryMap[rootId] || [];

      // Department filter
      if (selectedDepartment !== "all" && cat.slug !== selectedDepartment && cat._id !== selectedDepartment) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = cat.name?.toLowerCase().includes(query);
        const matchesDescription = cat.description?.toLowerCase().includes(query);
        const matchesSubcategory = subcats.some((sub) => sub.name?.toLowerCase().includes(query));
        return matchesName || matchesDescription || matchesSubcategory;
      }

      return true;
    });
  }, [rootCategories, subcategoryMap, searchQuery, selectedDepartment]);

  return (
    <section className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 my-6 sm:my-8" id="retail-categories">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-400/15 text-amber-600 border border-amber-400/30 uppercase tracking-wider">
              <FiLayers className="text-xs" />
              Complete B2C Showcase
            </span>
            <span className="text-xs font-bold text-textColor-muted">
              {rootCategories.length} Departments Available
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-textColor-primary tracking-tight">
            Shop by Retail Category
          </h2>
          <p className="text-xs sm:text-sm text-textColor-secondary mt-1">
            Browse genuine products across all certified consumer departments with fast pan-India delivery.
          </p>
        </div>

        {/* Search bar & View All Link */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-textColor-muted text-sm" />
            <input
              type="text"
              placeholder="Search category or subcategory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-surface-card border border-border/80 rounded-xl text-xs sm:text-sm text-textColor-primary focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textColor-muted hover:text-textColor-primary"
              >
                <FiX className="text-xs" />
              </button>
            )}
          </div>

          <Link
            to="/retail/categories"
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-amber-400 hover:bg-black transition-colors border border-amber-400/30 shadow-xs"
          >
            <span>View All Directory</span>
            <FiArrowRight className="text-xs" />
          </Link>
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredCategories.map((category) => {
            const rootId = category._id || category.id;
            const subcats = subcategoryMap[rootId] || [];

            return (
              <RetailCategoryCard
                key={rootId}
                category={category}
                subcategories={subcats}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-surface-card rounded-2xl border border-border/80 p-8 text-center max-w-md mx-auto my-6">
          <FiGrid className="w-12 h-12 text-textColor-muted mx-auto mb-3" />
          <h3 className="text-base font-bold text-textColor-primary mb-1">
            No Categories Found
          </h3>
          <p className="text-xs text-textColor-muted mb-4">
            No retail category matched "{searchQuery}". Try searching for another department.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-500 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Directory CTA Banner */}
      <div className="mt-8 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-black p-5 sm:p-7 border border-amber-400/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-md">
        <div>
          <h3 className="text-base sm:text-lg font-black text-amber-400 tracking-tight">
            Looking for something specific among 3,000+ Subcategories?
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
            Access our master catalog directory with comprehensive multi-tier department breakdown.
          </p>
        </div>
        <Link
          to="/retail/categories"
          className="shrink-0 px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 transition-all shadow-md transform hover:-translate-y-0.5"
        >
          Explore All Categories Directory →
        </Link>
      </div>
    </section>
  );
};

export default React.memo(RetailCategoryShowcase);
