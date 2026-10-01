import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiChevronDown,
  FiShoppingBag,
  FiBox,
  FiChevronRight,
  FiArrowRight,
  FiTag,
  FiTruck,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { categories as catalogCategories } from "../../../../data/categories";

const NAV_SHORTCUTS = [
  { name: "Grocery & Essentials", path: "/category/groceries", badge: "Daily" },
  { name: "Fashion", path: "/category/fashion" },
  { name: "Electronics", path: "/category/electronics", badge: "Hot" },
  { name: "Home & Kitchen", path: "/category/home" },
  { name: "Beauty & Personal Care", path: "/category/beauty" },
  { name: "Toys & Baby", path: "/category/toys" },
  { name: "Books & Stationery", path: "/category/books" },
  { name: "More Categories", path: "/categories" },
];

const MEGA_MENU_COLUMNS = [
  {
    title: "Grocery & Staples",
    items: [
      { name: "Fresh Fruits & Vegetables", path: "/category/fruits-vegetables" },
      { name: "Atta, Dal & Rice", path: "/category/staples" },
      { name: "Oils, Ghee & Spices", path: "/category/spices" },
      { name: "Snacks & Packaged Foods", path: "/category/snacks" },
      { name: "Beverages & Dairy", path: "/category/beverages" },
    ],
  },
  {
    title: "Fashion & Lifestyle",
    items: [
      { name: "Men's Clothing & Shirts", path: "/category/mens-wear" },
      { name: "Women's Ethnic & Western", path: "/category/womens-wear" },
      { name: "Footwear & Sneakers", path: "/category/footwear" },
      { name: "Watches, Bags & Wallets", path: "/category/accessories" },
      { name: "Jewellery & Silverware", path: "/category/jewellery" },
    ],
  },
  {
    title: "Electronics & Appliances",
    items: [
      { name: "Smartphones & Tablets", path: "/category/smartphones" },
      { name: "Smart Watches & Fitness", path: "/category/smart-watches" },
      { name: "Headphones & Audio", path: "/category/audio" },
      { name: "Kitchen & Home Appliances", path: "/category/appliances" },
      { name: "Computer Accessories", path: "/category/computer" },
    ],
  },
  {
    title: "B2B & Business Wholesale",
    highlight: true,
    items: [
      { name: "Textiles & Garment Bulk", path: "/wholesale?category=textiles" },
      { name: "FMCG Bulk Sourcing", path: "/wholesale?category=fmcg" },
      { name: "Industrial Machinery & Tools", path: "/wholesale?category=machinery" },
      { name: "OEM & Packaging Supplies", path: "/wholesale?category=packaging" },
      { name: "Custom Bulk Orders & RFQ", path: "/wholesale" },
    ],
  },
];

const HomeSecondaryNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

  const megaMenuRef = useRef(null);
  const marketplaceRef = useRef(null);
  const megaTimeoutRef = useRef(null);
  const marketTimeoutRef = useRef(null);

  const isRetailActive = location.pathname === "/retail" || location.pathname.startsWith("/retail/");
  const isWholesaleActive = location.pathname === "/wholesale" || location.pathname === "/b2b" || location.pathname.startsWith("/wholesale/");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setIsMegaMenuOpen(false);
      }
      if (marketplaceRef.current && !marketplaceRef.current.contains(e.target)) {
        setIsMarketplaceOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
      if (marketTimeoutRef.current) clearTimeout(marketTimeoutRef.current);
    };
  }, []);

  const handleMegaEnter = () => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setIsMegaMenuOpen(true);
  };
  const handleMegaLeave = () => {
    megaTimeoutRef.current = setTimeout(() => setIsMegaMenuOpen(false), 150);
  };

  const handleMarketEnter = () => {
    if (marketTimeoutRef.current) clearTimeout(marketTimeoutRef.current);
    setIsMarketplaceOpen(true);
  };
  const handleMarketLeave = () => {
    marketTimeoutRef.current = setTimeout(() => setIsMarketplaceOpen(false), 150);
  };

  return (
    <nav className="bg-[#17365D] border-b border-[#244b7a] text-white shadow-sm relative z-40">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 h-11 text-xs">
        {/* Left: All Categories Trigger + Nav Shortcuts */}
        <div className="flex items-center gap-1 xl:gap-2 overflow-x-auto scrollbar-none py-1">
          {/* All Categories Mega Menu Dropdown */}
          <div
            ref={megaMenuRef}
            className="relative shrink-0"
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMegaLeave}
          >
            <button
              type="button"
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f2440] hover:bg-[#0b1b30] text-amber-300 font-bold rounded-lg border border-amber-400/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <FiGrid className="text-sm text-amber-400" />
              <span>All Categories</span>
              <FiChevronDown
                className={`text-xs transition-transform duration-200 ${
                  isMegaMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Mega Menu Dropdown Panel */}
            <AnimatePresence>
              {isMegaMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.99 }}
                  transition={{ duration: 0.16 }}
                  className="absolute left-0 mt-2 w-[760px] lg:w-[920px] bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-200 p-5 z-50 overflow-hidden"
                  onMouseEnter={handleMegaEnter}
                  onMouseLeave={handleMegaLeave}
                >
                  {/* Top Header inside Mega Menu */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#17365D]">
                        Explore Complete Marketplace Catalog
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Over 25,000+ verified retail and wholesale products
                      </p>
                    </div>
                    <Link
                      to="/categories"
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <span>View All Categories</span>
                      <FiArrowRight className="text-xs" />
                    </Link>
                  </div>

                  {/* 4 Column Directory */}
                  <div className="grid grid-cols-4 gap-4">
                    {MEGA_MENU_COLUMNS.map((col, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl p-3 ${
                          col.highlight
                            ? "bg-[#17365D]/5 border border-[#17365D]/20"
                            : "bg-gray-50/80"
                        }`}
                      >
                        <h4
                          className={`font-black text-xs mb-2.5 pb-1 border-b ${
                            col.highlight
                              ? "text-[#17365D] border-[#17365D]/20"
                              : "text-gray-900 border-gray-200"
                          }`}
                        >
                          {col.title}
                        </h4>
                        <ul className="space-y-1.5">
                          {col.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <Link
                                to={item.path}
                                onClick={() => setIsMegaMenuOpen(false)}
                                className="text-[11px] text-gray-600 hover:text-[#17365D] hover:font-semibold flex items-center justify-between group transition-colors py-0.5"
                              >
                                <span className="truncate">{item.name}</span>
                                <FiChevronRight className="text-[10px] text-gray-400 group-hover:text-[#17365D] group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Footer strip in Mega Menu */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 bg-gray-50 -mx-5 -mb-5 px-5 py-2.5">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FiTruck className="text-emerald-600" /> Free Shipping &gt; ₹499
                      </span>
                      <span className="flex items-center gap-1">
                        <FiShield className="text-blue-600" /> 100% Genuine Guarantee
                      </span>
                    </div>
                    <Link
                      to="/wholesale"
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="text-amber-700 font-bold hover:underline"
                    >
                      Looking for Bulk B2B Buying? Visit Wholesale Hub →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Department Shortcuts */}
          <div className="flex items-center gap-0.5 xl:gap-1 whitespace-nowrap">
            {NAV_SHORTCUTS.map((shortcut, idx) => (
              <Link
                key={idx}
                to={shortcut.path}
                className="px-2 xl:px-2.5 py-1 text-gray-200 hover:text-white hover:bg-white/10 rounded-md transition-colors font-medium flex items-center gap-1 text-[11px] xl:text-xs"
              >
                <span>{shortcut.name}</span>
                {shortcut.badge && (
                  <span
                    className={`text-[9px] font-bold px-1 rounded ${
                      shortcut.badge === "Hot"
                        ? "bg-orange-500 text-white"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {shortcut.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Marketplace Switcher Dropdown & Sell on Dwell Mart CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Marketplace Mode Dropdown */}
          <div
            ref={marketplaceRef}
            className="relative shrink-0"
            onMouseEnter={handleMarketEnter}
            onMouseLeave={handleMarketLeave}
          >
            <button
              type="button"
              onClick={() => setIsMarketplaceOpen(!isMarketplaceOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                isMarketplaceOpen || isRetailActive || isWholesaleActive
                  ? "bg-amber-400 text-black border-amber-300 shadow-sm"
                  : "bg-white/10 text-amber-300 hover:bg-white/15 border-amber-400/40"
              }`}
            >
              <FiShoppingBag className="text-xs" />
              <span>Marketplace</span>
              <FiChevronDown
                className={`text-[10px] transition-transform duration-200 ${
                  isMarketplaceOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Options */}
            <AnimatePresence>
              {isMarketplaceOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-2 w-72 bg-white text-gray-900 rounded-xl shadow-2xl border border-gray-200 p-2.5 z-50"
                  onMouseEnter={handleMarketEnter}
                  onMouseLeave={handleMarketLeave}
                >
                  <div className="text-[10px] font-black uppercase text-gray-400 px-2 py-1 tracking-wider">
                    Select Shopping Experience
                  </div>

                  {/* Option 1: Retail Shopping */}
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/retail");
                      setIsMarketplaceOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between group transition-colors mb-1.5 ${
                      isRetailActive ? "bg-amber-50 border border-amber-300" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold text-sm">
                        <FiShoppingBag />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-gray-900 group-hover:text-amber-700">
                          Retail Shopping
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Shop individual items, deals & essentials
                        </div>
                      </div>
                    </div>
                    <FiChevronRight className="text-xs text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Option 2: Wholesale Hub */}
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/wholesale");
                      setIsMarketplaceOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between group transition-colors ${
                      isWholesaleActive ? "bg-blue-50 border border-blue-300" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#17365D] text-white flex items-center justify-center font-bold text-sm">
                        <FiBox />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-gray-900 group-hover:text-[#17365D]">
                          Wholesale Hub
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Bulk orders, quantity tiers & MOQ pricing
                        </div>
                      </div>
                    </div>
                    <FiChevronRight className="text-xs text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sell on Dwell Mart CTA Button */}
          <Link
            to="/sell-on-dwellmart"
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1 whitespace-nowrap active:scale-95"
          >
            <FiTrendingUp className="text-xs" />
            <span>Sell on Dwell Mart</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeSecondaryNav;
