import { useState } from "react";
import { Link } from "react-router-dom";
import { FiTrendingUp, FiAward, FiStar, FiClock, FiHeart, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../../../shared/components/ProductCard";

const HomeRetailB2CSection = ({
  trending = [],
  bestSellers = [],
  newArrivals = [],
  recommended = [],
}) => {
  const [activeTab, setActiveTab] = useState("trending");

  const tabs = [
    { id: "trending", label: "Trending Products", icon: FiTrendingUp, data: trending, link: "/search?sort=rating" },
    { id: "bestSellers", label: "Best Sellers", icon: FiAward, data: bestSellers, link: "/search?sort=popular" },
    { id: "newArrivals", label: "New Arrivals", icon: FiClock, data: newArrivals, link: "/new-arrivals" },
    { id: "recommended", label: "Recommended for You", icon: FiStar, data: recommended, link: "/shop" },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const activeProducts = (currentTab.data || []).slice(0, 12);

  return (
    <section className="py-8 sm:py-12 bg-[#F5F7FA]">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                Personal Shopping
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
              Retail Shopping Experience
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Verified multi-vendor products with doorstep delivery and 7-day hassle-free returns
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#17365D] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className={`text-xs ${isActive ? "text-amber-400" : "text-gray-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
          >
            {activeProducts.map((product, idx) => (
              <ProductCard
                key={product.id || idx}
                product={product}
                variant="default"
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Bar: See Full Catalog */}
        <div className="mt-8 pt-4 border-t border-gray-200/80 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Showing curated selections for <span className="font-bold text-gray-800">{currentTab.label}</span>
          </div>

          <Link
            to={currentTab.link}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#17365D] hover:text-amber-600 transition-colors group"
          >
            <span>View Full {currentTab.label} Collection</span>
            <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeRetailB2CSection;
