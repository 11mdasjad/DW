import React from "react";
import { Link } from "react-router-dom";
import CategoryImage from "../../../../shared/components/CategoryImage";

/**
 * RetailQuickCategoryRibbon
 *
 * Horizontal scrollable quick-navigation strip displaying circular thumbnails
 * for all root categories. Placed right under hero banner for immediate discovery.
 */
const RetailQuickCategoryRibbon = ({ categories = [], activeCategoryId = null }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full bg-surface-card border-y border-border/60 py-3 shadow-2xs">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto scrollbar-hide py-1 snap-x snap-mandatory">
          {categories.map((category) => {
            const catId = category._id || category.id;
            const isActive = activeCategoryId === catId;

            return (
              <Link
                key={catId}
                to={`/category/${catId}`}
                className="group flex flex-col items-center shrink-0 snap-start focus:outline-none"
                style={{ width: "72px" }}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-1 transition-all duration-300 flex items-center justify-center overflow-hidden border ${
                    isActive
                      ? "ring-2 ring-amber-400 border-amber-400 bg-amber-400/10 shadow-sm"
                      : "border-border/60 bg-surface-background group-hover:border-amber-400/60 group-hover:shadow-md group-hover:scale-105"
                  }`}
                >
                  <CategoryImage
                    src={category.image}
                    alt={category.name}
                    name={category.name}
                    className="w-full h-full object-contain rounded-xl transition-transform duration-300 group-hover:scale-110"
                    containerClassName="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
                  />
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold text-center mt-1.5 line-clamp-1 w-full transition-colors ${
                    isActive
                      ? "text-amber-500 font-extrabold"
                      : "text-textColor-secondary group-hover:text-amber-500"
                  }`}
                  title={category.name}
                >
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(RetailQuickCategoryRibbon);
