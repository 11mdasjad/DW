import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronRight, FiBox, FiCheckCircle } from "react-icons/fi";
import CategoryImage from "../../../../shared/components/CategoryImage";

const WholesaleCategoryCard = ({ category, subcategories = [], index = 0 }) => {
  const navigate = useNavigate();
  const categoryId = category._id || category.id;
  const topSubcategories = subcategories.slice(0, 3);
  const remainingCount = Math.max(0, subcategories.length - 3);

  const handleCardClick = () => {
    navigate(`/category/${categoryId}?experience=wholesale`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-surface-card border border-borderToken-default hover:border-amber-400/80 shadow-xs hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top Wholesale Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          {/* Category Thumbnail */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400/30 group-hover:border-amber-400 shadow-sm flex-shrink-0 p-1 flex items-center justify-center transition-all group-hover:scale-105">
            <CategoryImage
              src={category.image || category.icon}
              alt={category.name}
              name={category.name}
              className="w-full h-full object-contain rounded-xl"
              containerClassName="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
            />
            <span className="absolute top-1 left-1 px-1 py-0.2 bg-amber-400 text-black text-[8px] font-black rounded-xs shadow-xs leading-none">
              MOQ
            </span>
          </div>

          {/* Title & Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-extrabold text-xs sm:text-sm text-textColor-primary group-hover:text-amber-500 transition-colors truncate">
                {category.name}
              </h3>
            </div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-textColor-secondary mt-0.5 flex items-center gap-1">
              <FiBox className="text-[10px] text-amber-500 shrink-0" />
              <span>
                {subcategories.length > 0
                  ? `${subcategories.length} wholesale subcategories`
                  : "Factory Direct Lots"}
              </span>
            </p>
            <span className="inline-block mt-1 text-[9px] font-bold text-amber-600 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/25">
              Tiered Slabs Available
            </span>
          </div>
        </div>

        {/* Top Subcategories Pills */}
        {topSubcategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {topSubcategories.map((sub) => {
              const subId = sub._id || sub.id;
              return (
                <button
                  key={subId}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/category/${subId}?experience=wholesale`);
                  }}
                  className="px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold bg-surface-background text-textColor-secondary border border-borderToken-default hover:bg-amber-400/20 hover:text-amber-800 hover:border-amber-400/40 transition-colors text-left truncate max-w-[140px] cursor-pointer"
                >
                  {sub.name}
                </button>
              );
            })}
            {remainingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-lg text-[10px] font-bold text-amber-600 bg-amber-400/10">
                +{remainingCount} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="pt-2 border-t border-borderToken-default flex items-center justify-between text-[11px] font-bold text-textColor-muted group-hover:text-amber-500 transition-colors mt-auto">
        <span>Source Wholesale Lots</span>
        <FiChevronRight className="text-xs group-hover:translate-x-1 transition-transform text-amber-500" />
      </div>
    </motion.div>
  );
};

export default WholesaleCategoryCard;
