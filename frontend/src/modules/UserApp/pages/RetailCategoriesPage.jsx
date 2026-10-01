import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiSearch,
  FiArrowLeft,
  FiChevronRight,
  FiX,
  FiShoppingBag,
  FiLayers,
  FiCheckCircle,
  FiPackage
} from "react-icons/fi";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import CategoryImage from "../../../shared/components/CategoryImage";
import { useCategoryStore } from "../../../shared/store/categoryStore";
import { useExperienceStore } from "../../../shared/store/experienceStore";
import { EXPERIENCES } from "../../../shared/utils/experience";
import PageSkeleton from "../../../shared/components/Skeletons/PageSkeleton";

/**
 * RetailCategoriesPage
 *
 * Dedicated master directory of all B2C retail categories and subcategories.
 * Gives customers complete visibility over all 25 root departments and 3,000+ subcategories.
 */
const RetailCategoriesPage = () => {
  const navigate = useNavigate();
  const { setExperience } = useExperienceStore();
  const { categories, getRootCategories, getCategoriesByParent, initialize, isLoading } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const sectionRefs = useRef({});

  // Ensure experience is set to Marketplace (Retail)
  useEffect(() => {
    setExperience(EXPERIENCES.MARKETPLACE);
    initialize("marketplace");
  }, [setExperience, initialize]);

  // Root categories sorted by display order
  const rootCategories = useMemo(() => {
    return getRootCategories()
      .filter((cat) => cat.isActive !== false)
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  }, [getRootCategories]);

  // Subcategories mapping
  const subcategoryMap = useMemo(() => {
    const map = {};
    rootCategories.forEach((root) => {
      const rootId = root._id || root.id;
      map[rootId] = getCategoriesByParent(rootId).filter((c) => c.isActive !== false);
    });
    return map;
  }, [rootCategories, getCategoriesByParent]);

  // Filtered list
  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return rootCategories;
    const query = searchQuery.toLowerCase().trim();

    return rootCategories.filter((root) => {
      const rootId = root._id || root.id;
      const subcats = subcategoryMap[rootId] || [];
      const matchRoot = root.name?.toLowerCase().includes(query);
      const matchSub = subcats.some((s) => s.name?.toLowerCase().includes(query));
      return matchRoot || matchSub;
    });
  }, [rootCategories, subcategoryMap, searchQuery]);

  // Total subcategory count
  const totalSubcategories = useMemo(() => {
    return Object.values(subcategoryMap).reduce((acc, curr) => acc + curr.length, 0);
  }, [subcategoryMap]);

  const scrollToDepartment = (id) => {
    setActiveTab(id);
    const element = sectionRefs.current[id];
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <PageTransition>
      <MobileLayout>
        <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-textColor-muted mb-4">
            <Link to="/home" className="hover:text-amber-500 transition-colors">Home</Link>
            <FiChevronRight className="text-xs" />
            <Link to="/retail" className="hover:text-amber-500 transition-colors">Retail Store (B2C)</Link>
            <FiChevronRight className="text-xs" />
            <span className="text-textColor-primary font-bold">All Categories Directory</span>
          </nav>

          {/* Master Directory Header */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-black text-white p-6 sm:p-10 border border-amber-400/30 shadow-xl mb-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-400/10 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-black mb-3">
                <FiShoppingBag className="text-xs" />
                <span>B2C Retail Catalog</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-2 sm:mb-3">
                Complete Categories Directory
              </h1>

              <p className="text-xs sm:text-base text-gray-300 font-medium mb-6">
                Explore every department, certified category, and subcategory available for consumer shopping with nationwide delivery.
              </p>

              {/* Live search across all 25 categories & subcategories */}
              <div className="relative w-full max-w-xl">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
                <input
                  type="text"
                  placeholder="Search among 25 departments and 3,000+ subcategories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white/15"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FiX className="text-sm" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center gap-4 sm:gap-8 text-xs font-bold text-gray-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>{rootCategories.length} Departments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{totalSubcategories > 0 ? `${totalSubcategories}+` : "3,000+"} Subcategories</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>100% Genuine Retail Products</span>
              </div>
            </div>
          </div>

          {/* Quick-Jump Department Ribbon */}
          {!searchQuery && (
            <div className="mb-8 sticky top-16 z-30 bg-surface-background/95 backdrop-blur-md py-2 -mx-3 px-3 sm:-mx-6 sm:px-6 border-b border-border/60">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    activeTab === "all"
                      ? "bg-amber-400 text-black shadow-xs"
                      : "bg-surface-card border border-border/80 text-textColor-secondary hover:text-amber-500"
                  }`}
                >
                  All ({rootCategories.length})
                </button>
                {rootCategories.map((root) => {
                  const rootId = root._id || root.id;
                  const isActive = activeTab === rootId;
                  return (
                    <button
                      key={rootId}
                      type="button"
                      onClick={() => scrollToDepartment(rootId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                        isActive
                          ? "bg-amber-400 text-black shadow-xs"
                          : "bg-surface-card border border-border/80 text-textColor-secondary hover:text-amber-500"
                      }`}
                    >
                      {root.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Master Listing of Departments with Subcategories */}
          {isLoading ? (
            <PageSkeleton />
          ) : filteredDepartments.length > 0 ? (
            <div className="space-y-8 sm:space-y-12">
              {filteredDepartments.map((root) => {
                const rootId = root._id || root.id;
                const subcats = subcategoryMap[rootId] || [];

                return (
                  <div
                    key={rootId}
                    ref={(el) => (sectionRefs.current[rootId] = el)}
                    className="rounded-3xl bg-surface-card border border-border/70 p-5 sm:p-7 shadow-xs hover:shadow-md transition-shadow"
                  >
                    {/* Department Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/60 mb-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 overflow-hidden shrink-0 border border-border/80 p-1 flex items-center justify-center">
                          <CategoryImage
                            src={root.image}
                            alt={root.name}
                            name={root.name}
                            className="w-full h-full object-contain rounded-xl"
                            containerClassName="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg sm:text-2xl font-black text-textColor-primary tracking-tight">
                              {root.name}
                            </h2>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-400/15 text-amber-600 border border-amber-400/30">
                              {subcats.length} Subcategories
                            </span>
                          </div>
                          <p className="text-xs text-textColor-muted mt-0.5">
                            {root.description || `Browse complete collection of ${root.name}`}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={`/category/${rootId}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-amber-400 text-black hover:bg-amber-500 transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
                      >
                        <span>Browse All {root.name}</span>
                        <FiChevronRight className="text-sm" />
                      </Link>
                    </div>

                    {/* Subcategories Grid */}
                    {subcats.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
                        {subcats.map((sub) => {
                          const subId = sub._id || sub.id;
                          return (
                            <Link
                              key={subId}
                              to={`/category/${subId}`}
                              className="group flex flex-col justify-between p-3 rounded-2xl bg-surface-background hover:bg-amber-400/10 border border-border/60 hover:border-amber-400/50 transition-all duration-200"
                            >
                              <div className="w-10 h-10 rounded-xl bg-surface-card border border-border/50 p-1 mb-2 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
                                <CategoryImage
                                  src={sub.image || root.image}
                                  alt={sub.name}
                                  name={sub.name}
                                  className="w-full h-full object-contain rounded-lg"
                                  containerClassName="w-full h-full rounded-lg overflow-hidden flex items-center justify-center"
                                />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-textColor-primary group-hover:text-amber-600 transition-colors line-clamp-1">
                                  {sub.name}
                                </h4>
                                <span className="text-[10px] text-textColor-muted flex items-center gap-1 mt-0.5">
                                  <span>View items</span>
                                  <FiChevronRight className="text-[9px] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface-background text-xs text-textColor-muted text-center">
                        All products listed directly under {root.name}. Click "Browse All {root.name}" above.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-surface-card rounded-3xl border border-border/80 max-w-md mx-auto my-8">
              <FiLayers className="w-14 h-14 text-textColor-muted mx-auto mb-3" />
              <h3 className="text-lg font-bold text-textColor-primary mb-1">
                No Categories Found
              </h3>
              <p className="text-xs text-textColor-muted mb-4">
                No category or subcategory matched your query "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-500 transition-colors"
              >
                Clear Search & Show All
              </button>
            </div>
          )}
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default RetailCategoriesPage;
