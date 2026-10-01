import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSearch,
  FiChevronRight,
  FiLayers,
  FiBox,
  FiGrid,
  FiX
} from "react-icons/fi";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import CategoryImage from "../../../shared/components/CategoryImage";
import { useCategoryStore } from "../../../shared/store/categoryStore";
import { useExperienceStore } from "../../../shared/store/experienceStore";
import { EXPERIENCES } from "../../../shared/utils/experience";

const WholesaleCategoriesPage = () => {
  const navigate = useNavigate();
  const { categories, initialize, getCategoriesByParent } = useCategoryStore();
  const { setExperience } = useExperienceStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParentId, setSelectedParentId] = useState(null);

  useEffect(() => {
    setExperience(EXPERIENCES.WHOLESALE);
    initialize("wholesale");
  }, [setExperience, initialize]);

  // Root categories
  const rootCategories = useMemo(() => {
    return categories
      .filter((c) => (!c.parentId && !c.parent) && c.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [categories]);

  // Set default selected parent once loaded
  useEffect(() => {
    if (!selectedParentId && rootCategories.length > 0) {
      setSelectedParentId(rootCategories[0]._id || rootCategories[0].id);
    }
  }, [rootCategories, selectedParentId]);

  // Subcategories mapped by parent ID
  const subcategoriesMap = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => {
      const parentId =
        cat.parentId ||
        (typeof cat.parent === "object" ? cat.parent?._id || cat.parent?.id : cat.parent);
      if (parentId) {
        const key = String(parentId).trim();
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(cat);
      }
    });
    return map;
  }, [categories]);

  // Filtered categories based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) => c.isActive !== false && c.name?.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const activeParent = useMemo(() => {
    if (!selectedParentId) return rootCategories[0] || null;
    return (
      rootCategories.find(
        (c) => String(c._id || c.id).trim() === String(selectedParentId).trim()
      ) || rootCategories[0]
    );
  }, [rootCategories, selectedParentId]);

  const activeSubcategories = useMemo(() => {
    if (!activeParent) return [];
    const parentId = String(activeParent._id || activeParent.id).trim();
    return subcategoriesMap.get(parentId) || [];
  }, [activeParent, subcategoriesMap]);

  return (
    <PageTransition>
      <MobileLayout showBottomNav showCartBar>
        <div className="w-full pb-24 min-h-screen bg-surface-background text-textColor-primary">
          {/* Header Bar */}
          <div className="sticky top-0 z-30 bg-surface-card border-b border-borderToken-default shadow-xs px-3 sm:px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate("/wholesale")}
                  className="p-2 rounded-xl bg-surface-background hover:bg-borderToken-light border border-borderToken-default text-textColor-secondary cursor-pointer"
                  aria-label="Back to Wholesale Hub"
                >
                  <FiArrowLeft className="text-lg" />
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-base sm:text-lg font-black text-textColor-primary leading-tight">
                      All Wholesale Categories
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black">
                      B2B Sourcing
                    </span>
                  </div>
                  <nav className="flex items-center gap-1 text-[11px] text-textColor-muted">
                    <Link to="/home" className="hover:text-amber-500">Home</Link>
                    <FiChevronRight className="text-[10px]" />
                    <Link to="/wholesale" className="hover:text-amber-500">Wholesale Hub</Link>
                    <FiChevronRight className="text-[10px]" />
                    <span className="font-semibold text-textColor-primary">Categories Directory</span>
                  </nav>
                </div>
              </div>

              {/* Direct Link back to Wholesale Hub */}
              <Link
                to="/wholesale"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400 text-amber-800 hover:text-black font-extrabold text-xs transition-colors"
              >
                <span>Wholesale Home</span>
                <FiChevronRight className="text-xs" />
              </Link>
            </div>

            {/* Live Search Input */}
            <div className="max-w-7xl mx-auto mt-3">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textColor-muted text-sm" />
                <input
                  type="text"
                  placeholder="Search across all 3,000+ wholesale categories & subcategories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-surface-background border border-borderToken-default focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-2xl text-xs sm:text-sm font-medium text-textColor-primary outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textColor-muted hover:text-textColor-primary p-1"
                  >
                    <FiX className="text-xs" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
            {/* If searching: display search results */}
            {searchResults !== null ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-textColor-secondary">
                    Search Results ({searchResults.length} categories found)
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-bold text-amber-600 hover:underline"
                  >
                    Clear Search
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-surface-card rounded-3xl border border-dashed border-borderToken-default">
                    <FiBox className="text-4xl text-amber-500 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-textColor-primary">No wholesale categories found</h3>
                    <p className="text-xs text-textColor-muted mt-1">Try another search keyword like "shirts", "footwear", "spices"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {searchResults.map((cat) => {
                      const catId = cat._id || cat.id;
                      return (
                        <Link
                          key={catId}
                          to={`/category/${catId}?experience=wholesale`}
                          className="group p-3 rounded-2xl bg-surface-card border border-borderToken-default hover:border-amber-400 hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-borderToken-default p-1 mb-2 group-hover:scale-105 transition-transform flex items-center justify-center">
                            <CategoryImage
                              src={cat.image || cat.icon}
                              alt={cat.name}
                              name={cat.name}
                              className="w-full h-full object-contain rounded-lg"
                              containerClassName="w-full h-full rounded-lg overflow-hidden flex items-center justify-center"
                            />
                          </div>
                          <span className="text-xs font-bold text-textColor-primary group-hover:text-amber-500 transition-colors line-clamp-2">
                            {cat.name}
                          </span>
                          <span className="mt-1 text-[9px] font-extrabold text-amber-600 bg-amber-400/10 px-1.5 py-0.5 rounded">
                            B2B Lots
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Two-Column Master Directory: Left tabs + Right Subcategories */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left: Department List / Tabs */}
                <div className="md:col-span-4 lg:col-span-3">
                  <div className="bg-surface-card rounded-2xl border border-borderToken-default p-2 sticky top-36">
                    <h3 className="text-xs font-black text-textColor-secondary uppercase tracking-wider px-3 py-2">
                      Wholesale Departments ({rootCategories.length})
                    </h3>
                    <div className="space-y-1 max-h-[70vh] overflow-y-auto scrollbar-thin">
                      {rootCategories.map((cat) => {
                        const catId = String(cat._id || cat.id).trim();
                        const isSelected = String(selectedParentId).trim() === catId;
                        const subCount = (subcategoriesMap.get(catId) || []).length;
                        return (
                          <button
                            key={catId}
                            type="button"
                            onClick={() => setSelectedParentId(catId)}
                            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                              isSelected
                                ? "bg-amber-400 text-black shadow-xs font-extrabold"
                                : "text-textColor-secondary hover:bg-surface-background hover:text-textColor-primary"
                            }`}
                          >
                            <span className="truncate">{cat.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                              isSelected ? "bg-black/15 text-black" : "bg-surface-background text-textColor-muted"
                            }`}>
                              {subCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Selected Department Details & Subcategories */}
                <div className="md:col-span-8 lg:col-span-9">
                  {activeParent && (
                    <div className="bg-surface-card rounded-2xl border border-borderToken-default p-4 sm:p-6 mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderToken-default mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400/40 p-1 shrink-0 flex items-center justify-center">
                            <CategoryImage
                              src={activeParent.image || activeParent.icon}
                              alt={activeParent.name}
                              name={activeParent.name}
                              className="w-full h-full object-contain rounded-xl"
                              containerClassName="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className="text-base sm:text-xl font-black text-textColor-primary">
                                {activeParent.name}
                              </h2>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black">
                                Wholesale
                              </span>
                            </div>
                            <p className="text-xs text-textColor-muted mt-0.5">
                              {activeSubcategories.length} subcategories • Factory Direct MOQ Sourcing
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/category/${activeParent._id || activeParent.id}?experience=wholesale`}
                          className="px-4 py-2 rounded-xl bg-amber-400 text-black font-extrabold text-xs hover:bg-amber-500 transition-colors text-center shrink-0 shadow-xs"
                        >
                          View All Products in {activeParent.name}
                        </Link>
                      </div>

                      {/* Subcategories Grid */}
                      {activeSubcategories.length === 0 ? (
                        <div className="text-center py-8 text-xs text-textColor-muted">
                          No direct subcategories listed under this department.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {activeSubcategories.map((sub) => {
                            const subId = sub._id || sub.id;
                            return (
                              <Link
                                key={subId}
                                to={`/category/${subId}?experience=wholesale`}
                                className="group p-3 rounded-xl bg-surface-background border border-borderToken-default hover:border-amber-400 hover:shadow-xs transition-all flex flex-col items-center text-center cursor-pointer"
                              >
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-borderToken-default p-1 mb-2 group-hover:scale-105 transition-transform flex items-center justify-center">
                                  <CategoryImage
                                    src={sub.image || sub.icon}
                                    alt={sub.name}
                                    name={sub.name}
                                    className="w-full h-full object-contain rounded-lg"
                                    containerClassName="w-full h-full rounded-lg overflow-hidden flex items-center justify-center"
                                  />
                                </div>
                                <span className="text-xs font-bold text-textColor-primary group-hover:text-amber-500 transition-colors line-clamp-1">
                                  {sub.name}
                                </span>
                                <span className="text-[10px] text-textColor-muted mt-0.5 flex items-center gap-0.5 group-hover:text-amber-600">
                                  <span>Source Bulk</span>
                                  <FiChevronRight className="text-[9px]" />
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default WholesaleCategoriesPage;
