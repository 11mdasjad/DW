import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCartStore, useUIStore } from "../../../../shared/store/useStore";
import { useWishlistStore } from "../../../../shared/store/wishlistStore";
import { useAuthStore } from "../../../../shared/store/authStore";
import { useExperienceStore } from "../../../../shared/store/experienceStore";
import { loginLogo } from "../../../../shared/utils/imagePaths";
import SearchBar from "../../../../shared/components/SearchBar";
import LanguageSelector from "../../../../shared/components/LanguageSelector";
import CurrencySelector from "../../../../shared/components/CurrencySelector";
import { usePageTranslation } from "../../../../hooks/usePageTranslation";
import {
  FiHeart,
  FiShoppingBag,
  FiBox,
  FiUser,
  FiLogOut,
  FiGrid,
  FiBell,
  FiMapPin,
  FiHome,
  FiPercent,
  FiTruck,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserNotificationStore } from "../../store/userNotificationStore";
import NotificationBell from "../../../../shared/components/Notifications/NotificationBell";
import { EXPERIENCES } from "../../../../shared/utils/experience";

const DesktopHeader = ({ hideSellButton = false }) => {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { location, isLocating } = useExperienceStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  const cartExperience = useCartStore((state) => state.cartExperience);
  useCartStore((state) => state.carts);
  const getCartCountForExperience = useCartStore((state) => state.getCartCountForExperience);
  const otherBasketCount = getCartCountForExperience(
    cartExperience === EXPERIENCES.QUICK_COMMERCE ? EXPERIENCES.MARKETPLACE : EXPERIENCES.QUICK_COMMERCE
  );
  const wishlistCount = useWishlistStore((state) => state.getItemCount());
  const unreadCount = useUserNotificationStore((state) => state.unreadCount);
  const { getTranslatedText: t } = usePageTranslation([
    "Home",
    "Shop",
    "Categories",
    "Offers",
    "Track Order",
    "Sell On Dwell Mart",
    "Profile",
    "Orders",
    "Logout",
    "Login",
  ]);
  const ensureHydrated = useUserNotificationStore((state) => state.ensureHydrated);
  const toggleCart = useUIStore((state) => state.toggleCart);

  // User account menu state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Marketplace hover dropdown state
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const marketplaceMenuRef = useRef(null);
  const marketplaceTimerRef = useRef(null);

  // Check if current route is part of either marketplace mode
  const isRetailActive = routeLocation.pathname === "/retail" || routeLocation.pathname.startsWith("/retail/");
  const isWholesaleActive = routeLocation.pathname === "/wholesale" || routeLocation.pathname === "/b2b" || routeLocation.pathname.startsWith("/wholesale/");
  const isMarketplaceActive = isRetailActive || isWholesaleActive;

  useEffect(() => {
    ensureHydrated();
  }, [ensureHydrated, isAuthenticated]);

  // Click-outside and keyboard escape listener for menus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsMarketplaceOpen(false);
        setShowUserMenu(false);
      }
    };

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (marketplaceMenuRef.current && !marketplaceMenuRef.current.contains(event.target)) {
        setIsMarketplaceOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (marketplaceTimerRef.current) clearTimeout(marketplaceTimerRef.current);
    };
  }, []);

  // Anti-flicker hover handlers for Marketplace menu
  const handleMarketplaceMouseEnter = () => {
    if (marketplaceTimerRef.current) clearTimeout(marketplaceTimerRef.current);
    setIsMarketplaceOpen(true);
  };

  const handleMarketplaceMouseLeave = () => {
    marketplaceTimerRef.current = setTimeout(() => {
      setIsMarketplaceOpen(false);
    }, 150);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/home");
  };

  return (
    <header className="hidden md:block sticky top-0 z-[999] bg-black shadow-xl border-b border-gray-800/80 w-full overflow-visible">
      <div className="w-full max-w-[1920px] mx-auto px-2 lg:px-3 xl:px-4 2xl:px-6 h-14 lg:h-16 xl:h-[68px] flex items-center justify-between gap-1 lg:gap-1.5 xl:gap-2.5 overflow-visible">
        
        {/* ════════════════════════════════════════════════════════════════════════
            LEFT SECTION:
            Logo → Home → Shop → Categories → Offers → Track Order → Marketplace → Sell on Dwell Mart
            ════════════════════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-1 lg:gap-1.5 xl:gap-2.5 shrink-0">
          {/* Logo */}
          <Link to="/home" className="shrink-0 flex items-center relative z-20">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ opacity: { duration: 0.4 }, y: { duration: 0.4 } }}
              className="flex items-center"
            >
              <img
                src={loginLogo}
                alt="Dwell Mart Logo"
                className="h-7 sm:h-8 lg:h-8 xl:h-9 w-auto max-w-[90px] lg:max-w-[105px] xl:max-w-[125px] 2xl:max-w-[150px] object-contain drop-shadow-md"
              />
            </motion.div>
          </Link>

          {/* Navigation Links in Required Order */}
          <nav className="flex items-center gap-0.5 sm:gap-1 xl:gap-1.5 2xl:gap-2 whitespace-nowrap">
            {/* 1. Home */}
            <Link
              to="/home"
              className={`font-semibold text-[11px] lg:text-xs xl:text-[13px] 2xl:text-sm flex items-center gap-1 xl:gap-1.5 transition-colors px-1 py-1 rounded-md ${
                routeLocation.pathname === "/" || routeLocation.pathname === "/home"
                  ? "text-[#ffc101]"
                  : "text-gray-300 hover:text-[#ffc101]"
              }`}
            >
              <FiHome className="text-xs xl:text-sm shrink-0" />
              <span>{t("Home")}</span>
            </Link>

            {/* 2. Shop */}
            <Link
              to="/shop"
              className={`font-semibold text-[11px] lg:text-xs xl:text-[13px] 2xl:text-sm flex items-center gap-1 xl:gap-1.5 transition-colors px-1 py-1 rounded-md ${
                routeLocation.pathname === "/shop"
                  ? "text-[#ffc101]"
                  : "text-gray-300 hover:text-[#ffc101]"
              }`}
            >
              <FiShoppingBag className="text-xs xl:text-sm shrink-0" />
              <span>{t("Shop")}</span>
            </Link>

            {/* 3. Categories */}
            <Link
              to={isWholesaleActive ? "/wholesale/categories" : "/categories"}
              className={`font-semibold text-[11px] lg:text-xs xl:text-[13px] 2xl:text-sm flex items-center gap-1 xl:gap-1.5 transition-colors px-1 py-1 rounded-md ${
                routeLocation.pathname === "/categories" ||
                routeLocation.pathname.startsWith("/category/") ||
                routeLocation.pathname === "/wholesale/categories" ||
                routeLocation.pathname === "/retail/categories"
                  ? "text-[#ffc101]"
                  : "text-gray-300 hover:text-[#ffc101]"
              }`}
            >
              <FiGrid className="text-xs xl:text-sm shrink-0" />
              <span>{t("Categories")}</span>
            </Link>

            {/* 4. Offers */}
            <Link
              to="/offers"
              className={`font-semibold text-[11px] lg:text-xs xl:text-[13px] 2xl:text-sm flex items-center gap-1 xl:gap-1.5 transition-colors px-1 py-1 rounded-md ${
                routeLocation.pathname === "/offers"
                  ? "text-[#ffc101]"
                  : "text-gray-300 hover:text-[#ffc101]"
              }`}
            >
              <FiPercent className="text-xs xl:text-sm shrink-0" />
              <span>{t("Offers")}</span>
            </Link>

            {/* 5. Track Order */}
            <Link
              to={isAuthenticated ? "/orders" : "/login"}
              className={`font-semibold text-[11px] lg:text-xs xl:text-[13px] 2xl:text-sm flex items-center gap-1 xl:gap-1.5 transition-colors px-1 py-1 rounded-md ${
                routeLocation.pathname === "/orders"
                  ? "text-[#ffc101]"
                  : "text-gray-300 hover:text-[#ffc101]"
              }`}
            >
              <FiTruck className="text-xs xl:text-sm shrink-0" />
              <span className="hidden xl:inline">{t("Track Order")}</span>
              <span className="xl:hidden">{t("Track")}</span>
            </Link>

            {/* 6. Marketplace Menu with Hover Dropdown (Placed immediately before Sell on Dwell Mart) */}
            <div
              ref={marketplaceMenuRef}
              className="relative shrink-0"
              onMouseEnter={handleMarketplaceMouseEnter}
              onMouseLeave={handleMarketplaceMouseLeave}
            >
              <button
                type="button"
                onClick={() => setIsMarketplaceOpen(!isMarketplaceOpen)}
                aria-expanded={isMarketplaceOpen}
                aria-haspopup="true"
                className={`px-2 xl:px-2.5 py-1 xl:py-1.5 rounded-lg xl:rounded-xl font-bold text-[11px] lg:text-xs xl:text-xs 2xl:text-sm flex items-center gap-1 xl:gap-1.5 transition-all cursor-pointer ${
                  isMarketplaceOpen || isMarketplaceActive
                    ? "bg-amber-400 text-black shadow-md shadow-amber-500/20 font-extrabold"
                    : "text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30"
                }`}
              >
                <FiShoppingBag className="text-xs xl:text-sm shrink-0" />
                <span>Marketplace</span>
                <FiChevronDown
                  className={`text-xs transition-transform duration-200 ${
                    isMarketplaceOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Floating Dropdown Panel */}
              <AnimatePresence>
                {isMarketplaceOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute left-0 mt-2 w-[340px] sm:w-[370px] bg-[#0c0d12] rounded-2xl border border-amber-500/40 shadow-2xl shadow-black/90 p-3 z-[1000] backdrop-blur-xl ring-1 ring-white/5"
                    onMouseEnter={handleMarketplaceMouseEnter}
                    onMouseLeave={handleMarketplaceMouseLeave}
                  >
                    {/* Header Tag */}
                    <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-white/5 mb-2.5">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/80">
                        Select Shopping Experience
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    </div>

                    <div className="space-y-2.5">
                      {/* Option 1: Retail Store */}
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/retail");
                          setIsMarketplaceOpen(false);
                        }}
                        className={`w-full group p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                          isRetailActive
                            ? "bg-gradient-to-r from-amber-500/25 via-amber-400/10 to-transparent border-amber-400 shadow-md shadow-amber-500/15"
                            : "bg-surface-card/60 hover:bg-gradient-to-r hover:from-amber-500/20 hover:via-amber-400/5 hover:to-transparent border-white/10 hover:border-amber-400/60 hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-black flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/25 shrink-0 group-hover:scale-105 transition-transform">
                            <FiShoppingBag className="text-xl" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                                Retail Store
                              </h4>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                B2C • Pan-India
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors mt-0.5">
                              Shop for everyday needs
                            </p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-amber-400 group-hover:text-black text-gray-400 flex items-center justify-center transition-all shrink-0">
                          <FiChevronRight className="text-base group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>

                      {/* Option 2: Wholesale Hub */}
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/wholesale");
                          setIsMarketplaceOpen(false);
                        }}
                        className={`w-full group p-3.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                          isWholesaleActive
                            ? "bg-gradient-to-r from-amber-500/25 via-amber-400/10 to-transparent border-amber-400 shadow-md shadow-amber-500/15"
                            : "bg-surface-card/60 hover:bg-gradient-to-r hover:from-amber-500/20 hover:via-amber-400/5 hover:to-transparent border-white/10 hover:border-amber-400/60 hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-zinc-800 to-black text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-xl shadow-md shrink-0 group-hover:scale-105 transition-transform">
                            <FiBox className="text-xl" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                                Wholesale Hub
                              </h4>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                B2B • Bulk / MOQ
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors mt-0.5">
                              Bulk buying for businesses
                            </p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-amber-400 group-hover:text-black text-gray-400 flex items-center justify-center transition-all shrink-0">
                          <FiChevronRight className="text-base group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    </div>

                    {/* Footer Tip */}
                    <div className="mt-2.5 pt-2 border-t border-white/5 px-2 flex items-center justify-between text-[10px] text-gray-400">
                      <span>Switch shopping modes anytime</span>
                      <span className="text-amber-400 font-bold">100% Verified</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 7. Sell on Dwell Mart (Directly beside Marketplace) */}
            {!hideSellButton && (
              <Link
                to="/sell-on-dwellmart"
                className="shrink-0 rounded-lg xl:rounded-xl border border-amber-400/80 bg-black/60 px-2 xl:px-2.5 py-1 xl:py-1.5 text-[11px] lg:text-xs font-bold text-amber-400 transition-all hover:bg-amber-400 hover:text-black shadow-sm shadow-amber-500/10 active:scale-95 whitespace-nowrap"
              >
                {t("Sell On Dwell Mart")}
              </Link>
            )}
          </nav>
        </div>

        {/* ════════════════════════════════════════════════════════════════════════
            8. SEARCH BAR: Responsive search bar that expands dynamically
            ════════════════════════════════════════════════════════════════════════ */}
        <div className="flex-1 min-w-[70px] max-w-[130px] md:max-w-[150px] lg:max-w-[180px] xl:max-w-[240px] 2xl:max-w-[320px] z-20">
          <SearchBar />
        </div>

        {/* Location Indicator (if detected or locating) */}
        {(location?.label || isLocating) && (
          <div
            className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-900/90 border border-gray-800 text-xs text-gray-300 max-w-[160px] truncate shrink-0 cursor-default"
            title={location?.label || "Detecting live location..."}
          >
            <FiMapPin className={`text-xs shrink-0 ${isLocating ? "text-amber-400 animate-pulse" : "text-[#ffc101]"}`} />
            <span className={`truncate text-[11px] font-medium ${isLocating ? "text-amber-400 animate-pulse" : "text-gray-300"}`}>
              {isLocating ? "Locating..." : location?.city || location?.label}
            </span>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════
            RIGHT SECTION:
            Language → Currency → Wishlist → Cart → Notifications → Login
            ════════════════════════════════════════════════════════════════════════ */}
        <div className="flex items-center gap-1 xl:gap-1.5 2xl:gap-2 shrink-0 relative z-30">
          {/* 9. Language */}
          <LanguageSelector variant="desktop" />

          {/* 10. Currency */}
          <CurrencySelector variant="desktop" />

          {/* Action Icons */}
          <div className="flex items-center gap-0.5 xl:gap-1 shrink-0">
            {/* 11. Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-1 xl:p-1.5 text-gray-300 hover:text-[#ffc101] transition-colors"
              title="Wishlist"
            >
              <FiHeart className="text-base xl:text-lg" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 xl:w-4 xl:h-4 rounded-full bg-red-500 text-white text-[9px] xl:text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* 12. Cart */}
            <button
              data-cart-icon
              onClick={toggleCart}
              className="relative p-1 xl:p-1.5 text-gray-300 hover:text-[#ffc101] transition-colors cursor-pointer"
              title={otherBasketCount > 0
                ? `Shopping Cart — ${otherBasketCount} more saved in your other basket`
                : "Shopping Cart"}
            >
              <FiShoppingBag className="text-base xl:text-lg" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 xl:w-4 xl:h-4 rounded-full bg-[#ffc101] text-black text-[9px] xl:text-[10px] font-extrabold flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
              {otherBasketCount > 0 && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900"
                  aria-hidden="true"
                />
              )}
            </button>

            {/* 13. Notifications */}
            {isAuthenticated ? (
              <NotificationBell iconClassName="text-base xl:text-lg text-gray-300 hover:text-[#ffc101]" />
            ) : (
              <Link
                to="/login"
                className="relative p-1 xl:p-1.5 text-gray-300 hover:text-[#ffc101] transition-colors"
                title="Notifications"
              >
                <FiBell className="text-base xl:text-lg" />
              </Link>
            )}
          </div>

          {/* 14. Login Button / User Avatar Menu */}
          {isAuthenticated ? (
            <div ref={userMenuRef} className="relative shrink-0 ml-0.5 xl:ml-1">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 xl:gap-1.5 p-0.5 xl:p-1 hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-700 cursor-pointer"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 xl:w-7 xl:h-7 rounded-full object-cover"
                  />
                ) : (
                  <HiOutlineUserCircle className="text-gray-300 text-xl xl:text-2xl" />
                )}
                <span className="hidden xl:inline-block text-xs font-semibold text-gray-200 max-w-[50px] 2xl:max-w-[80px] truncate">
                  {user?.name || "User"}
                </span>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-2 z-[60] min-w-[200px]"
                  >
                    <div className="px-3 py-2 border-b border-slate-800 mb-2">
                      <p className="font-bold text-white text-sm">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors text-left w-full"
                    >
                      <FiUser className="text-gray-400" />
                      <span className="text-gray-200 text-sm">{t("Profile")}</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors text-left w-full"
                    >
                      <FiShoppingBag className="text-gray-400" />
                      <span className="text-gray-200 text-sm">{t("Orders")}</span>
                    </Link>
                    <Link
                      to="/addresses"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors text-left w-full"
                    >
                      <FiMapPin className="text-gray-400" />
                      <span className="text-gray-200 text-sm">{t("My Addresses")}</span>
                    </Link>
                    <Link
                      to="/support"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors text-left w-full"
                    >
                      <FiBell className="text-gray-400" />
                      <span className="text-gray-200 text-sm">Support Desk</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-red-950/40 rounded-lg transition-colors text-left w-full text-red-400 mt-1 cursor-pointer"
                    >
                      <FiLogOut className="text-red-400" />
                      <span className="text-sm font-semibold">{t("Logout")}</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="shrink-0 whitespace-nowrap px-2.5 xl:px-3.5 py-1 xl:py-1.5 bg-[#ffc101] text-black border border-amber-400 rounded-lg xl:rounded-xl font-extrabold hover:bg-[#e6ac00] transition-all shadow-md text-xs xl:text-sm shadow-amber-500/20"
            >
              {t("Login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
