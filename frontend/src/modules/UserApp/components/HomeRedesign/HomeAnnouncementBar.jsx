import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiX, FiTag, FiTruck, FiBriefcase, FiPercent } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ANNOUNCEMENTS = [
  {
    id: 1,
    icon: FiTruck,
    text: "Free Express Shipping on all orders over ₹499 nationwide",
    badge: "Free Delivery",
    link: "/shop",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  },
  {
    id: 2,
    icon: FiBriefcase,
    text: "Wholesale & Bulk pricing available for business buyers with Tiered Discounts",
    badge: "B2B Wholesale",
    link: "/wholesale",
    badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/30",
  },
  {
    id: 3,
    icon: FiPercent,
    text: "Discover exciting daily deals and seasonal offers with up to 60% off",
    badge: "Mega Deals",
    link: "/offers",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-400/30",
  },
  {
    id: 4,
    icon: FiTag,
    text: "Sell on Dwell Mart — Zero onboarding fee for verified Indian sellers",
    badge: "Grow Business",
    link: "/sell-on-dwellmart",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  },
];

const HomeAnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-[#0f1d30] border-b border-[#223d60] text-gray-200 text-xs py-1.5 px-3 relative z-30 transition-colors">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-3">
        {/* Left Space / Quick Tag */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>India&apos;s Multi-Vendor Marketplace</span>
        </div>

        {/* Center Rotating Message */}
        <div className="flex-1 flex items-center justify-center min-h-[22px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="flex items-center gap-2 text-center"
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${current.badgeColor} shrink-0`}
              >
                {current.badge}
              </span>
              <Icon className="text-amber-400 text-xs shrink-0" />
              <Link
                to={current.link}
                className="hover:text-amber-300 transition-colors truncate font-medium hover:underline text-xs"
              >
                {current.text}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right CTA / Dismiss */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/wholesale"
            className="hidden sm:inline-block text-[11px] font-semibold text-amber-300 hover:text-amber-200 transition-colors"
          >
            Business Sourcing →
          </Link>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <FiX className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeAnnouncementBar;
