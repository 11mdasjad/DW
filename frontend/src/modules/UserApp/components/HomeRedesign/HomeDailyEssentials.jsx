import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiTruck, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import ProductCard from "../../../../shared/components/ProductCard";

const ESSENTIALS_CATEGORIES = [
  { id: "all", label: "All Essentials" },
  { id: "fresh", label: "Fresh Fruits & Veg" },
  { id: "dairy", label: "Dairy & Breakfast" },
  { id: "snacks", label: "Snacks & Munchies" },
  { id: "household", label: "Household & Cleaning" },
  { id: "personal", label: "Personal Care" },
];

const HomeDailyEssentials = ({ products = [] }) => {
  const [selectedSubCat, setSelectedSubCat] = useState("all");

  const displayProducts = Array.isArray(products) && products.length > 0 ? products.slice(0, 6) : [];

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6">
        {/* Header with Quick Delivery Indicator */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <FiTruck className="text-xs" />
                <span>Express Fulfillment</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
              Daily Essentials &amp; Quick Shopping
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Household necessities, pantry staples, and fresh groceries delivered to your door
            </p>
          </div>

          {/* Quick Sub-Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {ESSENTIALS_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedSubCat(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedSubCat === cat.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayProducts.map((product, idx) => (
            <motion.div
              key={product.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
            >
              <ProductCard product={product} variant="default" />
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner Strip: Fast Delivery Guarantee */}
        <div className="mt-8 rounded-2xl bg-emerald-50 border border-emerald-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              <FiShoppingBag />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-emerald-950">
                Stock Your Pantry with 100% Quality Guarantee
              </h4>
              <p className="text-xs text-emerald-800/80">
                Fresh produce hand-picked by local sellers with transparent expiry dates and temperature-safe handling.
              </p>
            </div>
          </div>

          <Link
            to="/category/groceries"
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>Shop Full Grocery Catalog</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeDailyEssentials;
