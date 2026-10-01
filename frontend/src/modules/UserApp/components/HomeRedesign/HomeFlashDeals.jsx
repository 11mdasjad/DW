import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiClock, FiZap, FiArrowRight, FiTag } from "react-icons/fi";
import { motion } from "framer-motion";
import ProductCard from "../../../../shared/components/ProductCard";

const HomeFlashDeals = ({ products = [] }) => {
  // 12-hour rotating deal countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayProducts = Array.isArray(products) && products.length > 0 ? products.slice(0, 6) : [];

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 bg-gradient-to-br from-[#17365D] via-[#0f2440] to-[#0a182b] text-white my-4 relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        {/* Header Bar with Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-orange-500/30">
              <FiZap />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Limited-Time Flash Deals
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                  Ending Soon
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Special marketplace price drops verified by sellers — Grab before stocks run out
              </p>
            </div>
          </div>

          {/* Countdown Blocks */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
              <FiClock className="text-sm" />
              <span>Ends In:</span>
            </div>

            <div className="flex items-center gap-1 font-mono text-sm font-black">
              <div className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-amber-300 min-w-[36px] text-center shadow-inner">
                {String(timeLeft.hours).padStart(2, "0")}
                <span className="block text-[8px] font-sans text-gray-400 font-normal">HRS</span>
              </div>
              <span className="text-amber-400 font-bold">:</span>
              <div className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-amber-300 min-w-[36px] text-center shadow-inner">
                {String(timeLeft.minutes).padStart(2, "0")}
                <span className="block text-[8px] font-sans text-gray-400 font-normal">MIN</span>
              </div>
              <span className="text-amber-400 font-bold">:</span>
              <div className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 text-amber-300 min-w-[36px] text-center shadow-inner">
                {String(timeLeft.seconds).padStart(2, "0")}
                <span className="block text-[8px] font-sans text-gray-400 font-normal">SEC</span>
              </div>
            </div>

            <Link
              to="/flash-sale"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors ml-4"
            >
              <span>See All Flash Deals</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayProducts.map((product, idx) => (
            <motion.div
              key={product.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="h-full"
            >
              <ProductCard product={product} isFlashSale={true} variant="default" />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-4 text-center lg:hidden">
          <Link
            to="/flash-sale"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-white px-4 py-2 rounded-xl bg-white/10 border border-white/20"
          >
            <span>View All Flash Deals</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFlashDeals;
