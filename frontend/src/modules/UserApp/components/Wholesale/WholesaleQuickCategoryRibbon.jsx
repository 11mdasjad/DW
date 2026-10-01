import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CategoryImage from "../../../../shared/components/CategoryImage";

const WholesaleQuickCategoryRibbon = ({ categories = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 shrink-0 animate-pulse">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-surface-card border border-borderToken-default" />
              <div className="w-12 h-3 bg-surface-card rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2">
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
        {categories.map((category) => {
          const catId = category._id || category.id;
          return (
            <motion.div
              key={catId}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0"
            >
              <Link
                to={`/category/${catId}?experience=wholesale`}
                className="group flex flex-col items-center text-center w-16 sm:w-20 cursor-pointer"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-400/40 group-hover:border-amber-500 shadow-sm group-hover:shadow-amber-500/20 transition-all p-1 flex items-center justify-center">
                  <CategoryImage
                    src={category.image || category.icon}
                    alt={category.name}
                    name={category.name}
                    className="w-full h-full object-contain rounded-xl"
                    containerClassName="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
                  />
                  <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-amber-400 text-black text-[8px] font-black rounded-sm shadow-xs leading-none">
                    B2B
                  </span>
                </div>
                <span className="mt-1.5 text-[10px] sm:text-xs font-bold text-textColor-primary leading-tight line-clamp-1 group-hover:text-amber-500 transition-colors">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WholesaleQuickCategoryRibbon;
