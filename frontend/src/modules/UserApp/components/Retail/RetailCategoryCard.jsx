import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight, FiGrid, FiArrowUpRight } from "react-icons/fi";
import CategoryImage from "../../../../shared/components/CategoryImage";

/**
 * RetailCategoryCard
 *
 * Dedicated image-based category card for the B2C Retail Store.
 * Shows category thumbnail image, title, subcategory count,
 * quick subcategory preview chips, and direct navigation to category page.
 */
const RetailCategoryCard = ({ category, subcategories = [], compact = false }) => {
  const navigate = useNavigate();
  const categoryId = category?._id || category?.id;
  const categoryLink = `/category/${categoryId}`;

  const topSubcategories = subcategories.slice(0, 4);

  const handleSubcategoryClick = (e, subId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/category/${subId}`);
  };

  if (compact) {
    return (
      <Link
        to={categoryLink}
        className="group flex flex-col items-center text-center p-3 rounded-2xl bg-surface-card border border-border/60 hover:border-amber-400/60 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2.5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-slate-800/10 p-1 flex items-center justify-center border border-border/40 group-hover:border-amber-400/40 transition-colors">
          <CategoryImage
            src={category.image}
            alt={category.name}
            name={category.name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
            containerClassName="w-full h-full rounded-xl overflow-hidden"
          />
        </div>
        <h4 className="text-xs sm:text-sm font-bold text-textColor-primary line-clamp-1 group-hover:text-amber-500 transition-colors">
          {category.name}
        </h4>
        {subcategories.length > 0 && (
          <span className="text-[10px] text-textColor-muted mt-0.5">
            {subcategories.length} subcategories
          </span>
        )}
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <div
        onClick={() => navigate(categoryLink)}
        className="group cursor-pointer h-full flex flex-col justify-between rounded-2xl bg-surface-card border border-border/70 hover:border-amber-400/60 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden relative"
      >
        {/* Top visual banner / image area */}
        <div className="relative w-full h-36 sm:h-44 bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden flex items-center justify-center p-3">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

          {/* Category Visual */}
          <div className="relative z-0 w-full h-full flex items-center justify-center">
            <CategoryImage
              src={category.image}
              alt={category.name}
              name={category.name}
              className="w-full h-full object-contain sm:object-cover group-hover:scale-110 transition-transform duration-700 filter drop-shadow-md"
              containerClassName="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
            />
          </div>

          {/* Subcategory Count Badge */}
          {subcategories.length > 0 && (
            <div className="absolute top-2.5 right-2.5 z-20">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30 shadow-xs">
                <FiGrid className="text-[9px]" />
                {subcategories.length} Subcategories
              </span>
            </div>
          )}

          {/* Category Title overlay at bottom of image */}
          <div className="absolute bottom-2.5 left-3 right-3 z-20 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-white drop-shadow-md tracking-tight group-hover:text-amber-300 transition-colors">
              {category.name}
            </h3>
            <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-amber-400 group-hover:text-black transition-all">
              <FiArrowUpRight className="text-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>

        {/* Bottom Area: Subcategory chips & exploration link */}
        <div className="p-3.5 flex-1 flex flex-col justify-between bg-surface-card">
          {topSubcategories.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {topSubcategories.map((sub) => (
                <button
                  key={sub._id || sub.id}
                  type="button"
                  onClick={(e) => handleSubcategoryClick(e, sub._id || sub.id)}
                  className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-surface-background hover:bg-amber-400/15 text-textColor-secondary hover:text-amber-600 border border-border/60 hover:border-amber-400/40 transition-all truncate max-w-[140px]"
                  title={sub.name}
                >
                  {sub.name}
                </button>
              ))}
              {subcategories.length > 4 && (
                <span className="px-2 py-1 rounded-lg text-[11px] font-medium text-textColor-muted bg-surface-background/50 border border-border/30">
                  +{subcategories.length - 4} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-textColor-muted mb-3 line-clamp-2">
              {category.description || `Browse quality ${category.name} products directly on Dwell Mart.`}
            </p>
          )}

          {/* Action Row */}
          <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-bold text-amber-500 group-hover:text-amber-600 transition-colors">
            <span>Explore Department</span>
            <FiChevronRight className="text-sm transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(RetailCategoryCard);
