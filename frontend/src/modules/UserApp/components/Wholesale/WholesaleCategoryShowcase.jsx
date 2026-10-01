import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiLayers, FiSearch, FiChevronRight, FiGrid, FiX } from "react-icons/fi";
import WholesaleCategoryCard from "./WholesaleCategoryCard";

const WholesaleCategoryShowcase = ({
  categories = [],
  allSubcategories = [],
  isLoading = false,
}) => {
  const [filterQuery, setFilterQuery] = useState("");

  // Map subcategories by parent category ID
  const subcategoriesByParent = useMemo(() => {
    const map = new Map();
    if (!Array.isArray(allSubcategories)) return map;

    allSubcategories.forEach((sub) => {
      const parentId =
        sub.parentId ||
        (typeof sub.parent === "object" ? sub.parent?._id || sub.parent?.id : sub.parent);
      if (parentId) {
        const key = String(parentId).trim();
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(sub);
      }
    });
    return map;
  }, [allSubcategories]);

  // Filter root categories by search query
  const filteredCategories = useMemo(() => {
    if (!filterQuery.trim()) return categories;
    const q = filterQuery.toLowerCase().trim();
    return categories.filter((cat) => {
      const nameMatch = cat.name?.toLowerCase().includes(q);
      const catId = String(cat._id || cat.id).trim();
      const subs = subcategoriesByParent.get(catId) || [];
      const subMatch = subs.some((s) => s.name?.toLowerCase().includes(q));
      return nameMatch || subMatch;
    });
  }, [categories, filterQuery, subcategoriesByParent]);

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
              <FiGrid className="text-lg" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-textColor-primary tracking-tight">
              All Wholesale Sourcing Departments
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-700 border border-amber-400/30">
              {categories.length} Departments
            </span>
          </div>
          <p className="text-xs text-textColor-muted mt-1">
            Factory direct lots with tiered wholesale pricing, minimum order quantities (MOQ), and commercial invoicing.
          </p>
        </div>

        {/* Live Filter & Directory Link */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-textColor-muted text-xs" />
            <input
              type="text"
              placeholder="Filter wholesale departments..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 bg-surface-card rounded-xl text-xs border border-borderToken-default focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-textColor-primary"
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => setFilterQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textColor-muted hover:text-textColor-primary p-0.5"
              >
                <FiX className="text-xs" />
              </button>
            )}
          </div>

          <Link
            to="/wholesale/categories"
            className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-surface-card hover:bg-amber-400/15 border border-borderToken-default hover:border-amber-400 text-textColor-primary hover:text-amber-600 transition-all shrink-0 cursor-pointer"
          >
            <span>Directory</span>
            <FiChevronRight className="text-xs" />
          </Link>
        </div>
      </div>

      {/* Grid of Categories */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-36 rounded-2xl bg-surface-card animate-pulse border border-borderToken-default"
            />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-surface-card border border-borderToken-default">
          <p className="text-sm font-bold text-textColor-primary">
            No wholesale departments match "{filterQuery}"
          </p>
          <button
            type="button"
            onClick={() => setFilterQuery("")}
            className="mt-3 px-4 py-1.5 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-500 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredCategories.map((category, index) => {
            const catId = String(category._id || category.id).trim();
            const subcategories = subcategoriesByParent.get(catId) || [];
            return (
              <WholesaleCategoryCard
                key={catId}
                category={category}
                subcategories={subcategories}
                index={index}
              />
            );
          })}
        </div>
      )}

      {/* Mobile Directory CTA */}
      <div className="mt-6 text-center sm:hidden">
        <Link
          to="/wholesale/categories"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-surface-card border border-borderToken-default text-xs font-bold text-textColor-primary hover:border-amber-400"
        >
          <span>Browse Full Wholesale Directory</span>
          <FiChevronRight className="text-xs" />
        </Link>
      </div>
    </section>
  );
};

export default WholesaleCategoryShowcase;
