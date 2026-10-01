import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBox,
  FiChevronRight,
  FiCheckCircle,
  FiShield,
  FiFileText,
  FiTruck,
  FiZap,
  FiSend,
  FiAward,
  FiStar,
  FiArrowRight,
  FiPackage,
  FiClock
} from "react-icons/fi";
import { Badge, Button } from "../../../../shared/components/ui";
import api from "../../../../shared/utils/api";

// Curated Alibaba-style B2B primary departments with rich subcategory flyout data
const ALIBABA_MARKET_CATEGORIES = [
  {
    id: "apparel-textiles",
    name: "Apparel & Accessories",
    icon: "👔",
    slug: "clothing",
    badge: "Hot Sourcing",
    subcategories: [
      { name: "Men's T-Shirts & Polos", slug: "clothing" },
      { name: "Women's Ethnic & Western Wear", slug: "clothing" },
      { name: "Denim & Jeans Cargo Lots", slug: "clothing" },
      { name: "Athletic & Activewear Sets", slug: "clothing" },
      { name: "Winter Jackets & Sweaters", slug: "clothing" },
      { name: "Cotton Fabrics & Blends", slug: "clothing" },
    ],
    verifiedSuppliers: "1,240+ Verified Mills",
    avgLeadTime: "3-5 Days",
  },
  {
    id: "consumer-electronics",
    name: "Consumer Electronics",
    icon: "📱",
    slug: "electronics",
    badge: "OEM/ODM",
    subcategories: [
      { name: "Smartwatches & Wearables", slug: "electronics" },
      { name: "Bluetooth Audio & Earbuds", slug: "electronics" },
      { name: "Fast Chargers & Power Banks", slug: "electronics" },
      { name: "Cables, Adapters & Mounts", slug: "electronics" },
      { name: "Smart Home Accessories", slug: "electronics" },
    ],
    verifiedSuppliers: "860+ Verified Factories",
    avgLeadTime: "2-4 Days",
  },
  {
    id: "home-kitchen",
    name: "Home, Kitchen & Living",
    icon: "🏡",
    slug: "home",
    badge: "Direct Factory",
    subcategories: [
      { name: "Stainless Steel Cookware", slug: "home" },
      { name: "Storage Containers & Organizers", slug: "home" },
      { name: "Bedding Sets & Linen", slug: "home" },
      { name: "Kitchen Gadgets & Tools", slug: "home" },
      { name: "Home Decor & Lighting", slug: "home" },
    ],
    verifiedSuppliers: "920+ Verified Makers",
    avgLeadTime: "3-7 Days",
  },
  {
    id: "footwear-bags",
    name: "Footwear & Leather Bags",
    icon: "👟",
    slug: "footwear",
    badge: "Bulk Lots",
    subcategories: [
      { name: "Casual Sneakers & Running Shoes", slug: "footwear" },
      { name: "Formal Leather Shoes & Boots", slug: "footwear" },
      { name: "Backpacks & Laptop Sleeves", slug: "accessories" },
      { name: "Ladies Handbags & Clutches", slug: "accessories" },
      { name: "Leather Belts & Wallets", slug: "accessories" },
    ],
    verifiedSuppliers: "540+ Verified Workshops",
    avgLeadTime: "4-6 Days",
  },
  {
    id: "beauty-personal-care",
    name: "Beauty & Personal Care",
    icon: "💄",
    slug: "beauty",
    badge: "Lab Tested",
    subcategories: [
      { name: "Skincare Serums & Creams", slug: "beauty" },
      { name: "Hair Care Shampoos & Oils", slug: "beauty" },
      { name: "Fragrances & Body Sprays", slug: "beauty" },
      { name: "Herbal & Organic Wellness", slug: "health" },
      { name: "Salon & Grooming Tools", slug: "beauty" },
    ],
    verifiedSuppliers: "430+ Certified Labs",
    avgLeadTime: "2-5 Days",
  },
  {
    id: "packaging-office",
    name: "Packaging & Logistics",
    icon: "📦",
    slug: "packaging",
    badge: "Custom Logo",
    subcategories: [
      { name: "Corrugated Shipping Cartons", slug: "packaging" },
      { name: "Biodegradable Courier Bags", slug: "packaging" },
      { name: "Custom Printed Tape & Straps", slug: "packaging" },
      { name: "Bubble Wrap & Air Pillows", slug: "packaging" },
      { name: "Barcode Labels & Thermal Rolls", slug: "packaging" },
    ],
    verifiedSuppliers: "310+ Mill Outlets",
    avgLeadTime: "2-3 Days",
  },
  {
    id: "jewelry-watches",
    name: "Jewelry, Eyewear & Watches",
    icon: "⌚",
    slug: "accessories",
    badge: "High Margin",
    subcategories: [
      { name: "Luxury Quartz & Digital Watches", slug: "accessories" },
      { name: "Fashion Sunglasses & Frames", slug: "accessories" },
      { name: "Fashion Jewelry & Necklaces", slug: "accessories" },
      { name: "Bangles, Rings & Bracelets", slug: "accessories" },
    ],
    verifiedSuppliers: "490+ Artisan Guilds",
    avgLeadTime: "3-5 Days",
  },
  {
    id: "industrial-hardware",
    name: "Tools, Hardware & Safety",
    icon: "🛠️",
    slug: "tools",
    badge: "Heavy Duty",
    subcategories: [
      { name: "Power Tools & Accessories", slug: "tools" },
      { name: "Industrial Safety Gloves & Helmets", slug: "tools" },
      { name: "Fasteners, Bolts & Screws", slug: "tools" },
      { name: "Measuring Instruments & Gauges", slug: "tools" },
    ],
    verifiedSuppliers: "280+ Heavy Units",
    avgLeadTime: "5-8 Days",
  },
];

// Alibaba High-Impact Sourcing Billboard Slides
const ALIBABA_HERO_SLIDES = [
  {
    id: "ali-slide-1",
    tag: "🏭 DIRECT FROM SOURCE MILLS",
    title: "Global Factory Direct Wholesale",
    subtitle: "Source directly from 4,500+ verified Indian & international manufacturers with transparent volume pricing tiers.",
    ctaText: "Source Bulk Lots",
    badge: "Verified Sourcing",
    theme: "from-amber-600 via-orange-600 to-amber-900",
    bgPattern: "radial-gradient(ellipse at top right, rgba(245, 158, 11, 0.4), transparent 70%)",
    stat: "Up to 50% Off",
    statLabel: "vs Intermediary Wholesale",
    slug: "clothing",
  },
  {
    id: "ali-slide-2",
    tag: "⚡ READY TO SHIP PAVILION",
    title: "Dispatch Within 48 Hours",
    subtitle: "Low MOQ starting from just 1 carton (10-20 units). Instant transparent checkout with real-time freight calculation.",
    ctaText: "Explore Ready to Ship",
    badge: "Low MOQ ≤ 20",
    theme: "from-blue-700 via-indigo-800 to-slate-950",
    bgPattern: "radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.4), transparent 70%)",
    stat: "48h Dispatch",
    statLabel: "Guaranteed Lead Time",
    slug: "electronics",
  },
  {
    id: "ali-slide-3",
    tag: "🛡️ TRADE ASSURANCE GUARANTEE",
    title: "100% Payment & Order Protection",
    subtitle: "Safe escrow payments, verified supplier audits, quality inspection before dispatch, and full GST input tax credit.",
    ctaText: "Learn About Protection",
    badge: "100% Insured",
    theme: "from-emerald-700 via-teal-800 to-slate-950",
    bgPattern: "radial-gradient(ellipse at top right, rgba(16, 185, 129, 0.4), transparent 70%)",
    stat: "₹0 Loss",
    statLabel: "Full Escrow Protection",
    slug: "home",
  },
];

/**
 * AlibabaHeroSourcingSection
 *
 * Implements the authentic Alibaba.com 3-column sourcing command center:
 * - Left: Department Directory with hover flyout subcategory panels
 * - Center: High-impact trade billboard slider with auto-advance and indicators
 * - Right: Buyer Sourcing Center ("Welcome Buyer", 1-Click RFQ Trigger, Trade Assurance)
 */
const AlibabaHeroSourcingSection = ({ onOpenRfqModal, categories = [] }) => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const sliderIntervalRef = useRef(null);

  // Dynamic slides combining default B2B trade slides + admin banners if present
  const [slides, setSlides] = useState(ALIBABA_HERO_SLIDES);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/banners")
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data ?? res;
        const rawBanners = Array.isArray(payload) ? payload : payload?.banners;
        if (Array.isArray(rawBanners) && rawBanners.length > 0) {
          const wsBanners = rawBanners.filter(
            (b) => b.isActive !== false && (b.type === "wholesale" || b.experience === "wholesale")
          );
          if (wsBanners.length > 0) {
            const formatted = wsBanners.map((b, idx) => ({
              id: b._id || b.id || `custom-ali-${idx}`,
              tag: b.tag || "🏭 DIRECT WHOLESALE",
              title: b.title || "Factory Direct Sourcing",
              subtitle: b.subtitle || b.description || "Direct volume pricing with 100% GST ITC",
              ctaText: b.buttonText || "Source Now",
              badge: b.badge || "Verified Mill",
              theme: idx % 2 === 0 ? "from-amber-600 via-orange-600 to-amber-900" : "from-blue-700 via-indigo-800 to-slate-950",
              bgPattern: "radial-gradient(ellipse at top right, rgba(245, 158, 11, 0.3), transparent 70%)",
              stat: "Direct Factory",
              statLabel: "Volume Tier Pricing",
              slug: b.categorySlug || b.link || "",
              image: b.image || b.imageUrl || "",
            }));
            setSlides(formatted);
          }
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-advance billboard slides
  useEffect(() => {
    if (slides.length <= 1) return;
    sliderIntervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (sliderIntervalRef.current) clearInterval(sliderIntervalRef.current);
    };
  }, [slides.length]);

  const currentSlide = slides[activeSlide] || ALIBABA_HERO_SLIDES[0];

  const handleCategoryClick = (category) => {
    if (category.slug) {
      navigate(`/category/${category.slug}?experience=wholesale`);
    } else {
      navigate("/wholesale/categories");
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
      {/* ── Alibaba 3-Column Grid Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-stretch relative">

        {/* ═══════════════════════════════════════════════════════════════
            LEFT COLUMN (Alibaba Department Directory Sidebar) - lg:col-span-3
            Hidden on small mobile (replaced by quick ribbon), visible on md/lg
            ═══════════════════════════════════════════════════════════════ */}
        <div
          className="hidden md:block lg:col-span-3 bg-surface-card rounded-2xl border border-borderToken-default shadow-xs p-2.5 relative z-20"
          onMouseLeave={() => setHoveredCategory(null)}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2.5 py-2 mb-1 border-b border-borderToken-default/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-xs font-black text-textColor-primary uppercase tracking-wider">
                My Markets
              </h2>
            </div>
            <Link
              to="/wholesale/categories"
              className="text-[11px] font-bold text-amber-500 hover:text-amber-600 hover:underline flex items-center gap-0.5"
            >
              All Categories <FiChevronRight className="text-[10px]" />
            </Link>
          </div>

          {/* Department List */}
          <nav className="space-y-0.5" aria-label="Wholesale Department Categories">
            {ALIBABA_MARKET_CATEGORIES.map((cat) => {
              const isHovered = hoveredCategory?.id === cat.id;
              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onClick={() => handleCategoryClick(cat)}
                  className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150 ${
                    isHovered
                      ? "bg-amber-500/10 text-amber-600 font-bold border-l-2 border-amber-500 pl-3"
                      : "text-textColor-secondary hover:text-textColor-primary hover:bg-surface-background"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-sm shrink-0">{cat.icon}</span>
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {cat.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-400/20 text-amber-600 hidden xl:inline-block">
                        {cat.badge}
                      </span>
                    )}
                    <FiChevronRight className={`text-xs text-textColor-muted transition-transform ${isHovered ? "translate-x-0.5 text-amber-500" : ""}`} />
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Bottom Trust Micro-banner */}
          <div className="mt-3 pt-2.5 border-t border-borderToken-default/60 px-2.5 flex items-center justify-between text-[11px] text-textColor-muted">
            <span className="flex items-center gap-1 font-medium">
              <FiCheckCircle className="text-emerald-500 text-xs" /> 4,500+ Verified Mills
            </span>
            <span className="font-bold text-amber-500">ISO Audited</span>
          </div>

          {/* ── Hover Flyout Subcategory Panel (Alibaba Signature Experience) ── */}
          <AnimatePresence>
            {hoveredCategory && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-0 left-full ml-2 w-[420px] bg-surface-card rounded-2xl border border-borderToken-default shadow-xl p-5 z-50 text-textColor-primary backdrop-blur-md"
                onMouseEnter={() => setHoveredCategory(hoveredCategory)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {/* Flyout Header */}
                <div className="flex items-center justify-between pb-3 border-b border-borderToken-default">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{hoveredCategory.icon}</span>
                    <div>
                      <h4 className="text-sm font-black text-textColor-primary">
                        {hoveredCategory.name}
                      </h4>
                      <p className="text-[11px] text-textColor-muted">
                        {hoveredCategory.verifiedSuppliers} • Lead: {hoveredCategory.avgLeadTime}
                      </p>
                    </div>
                  </div>
                  <Badge variant="gold" size="sm" className="!text-[10px]">
                    Direct Sourcing
                  </Badge>
                </div>

                {/* Subcategories Grid */}
                <div className="my-4">
                  <h5 className="text-[11px] font-black text-textColor-muted uppercase tracking-wider mb-2">
                    Trending Sourcing Lines
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {hoveredCategory.subcategories.map((sub, i) => (
                      <Link
                        key={i}
                        to={`/search?q=${encodeURIComponent(sub.name)}&experience=wholesale`}
                        className="text-xs text-textColor-secondary hover:text-amber-500 hover:bg-surface-background p-2 rounded-lg transition-colors truncate flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="truncate">{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Fast Procurement Sourcing Shortcuts */}
                <div className="pt-3 border-t border-borderToken-default/70 flex items-center justify-between">
                  <Link
                    to={`/category/${hoveredCategory.slug}?experience=wholesale`}
                    className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
                  >
                    View All {hoveredCategory.name} Lots <FiArrowRight className="text-xs" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setHoveredCategory(null);
                      onOpenRfqModal?.(hoveredCategory.name);
                    }}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-surface-background hover:bg-borderToken-light border border-borderToken-default text-textColor-primary flex items-center gap-1 cursor-pointer"
                  >
                    <FiSend className="text-amber-500 text-[10px]" /> Post RFQ for this
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            CENTER COLUMN (Alibaba Sourcing Pavilion Billboard Slider) - lg:col-span-6
            ═══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-6 flex flex-col justify-between relative rounded-2xl overflow-hidden border border-borderToken-default shadow-card min-h-[290px] sm:min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className={`w-full h-full p-5 sm:p-7 bg-gradient-to-br ${currentSlide.theme} text-white flex flex-col justify-between relative overflow-hidden`}
              style={{ backgroundImage: currentSlide.bgPattern }}
            >
              {/* Optional Background Image */}
              {currentSlide.image && (
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none mix-blend-overlay"
                />
              )}

              {/* Top Tag & Badge */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-amber-300 border border-amber-400/30">
                  {currentSlide.tag}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white">
                  {currentSlide.badge}
                </span>
              </div>

              {/* Title & Sourcing Value Proposition */}
              <div className="my-auto py-3 z-10 max-w-lg">
                <h3 className="text-xl sm:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                  {currentSlide.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 font-medium mt-2 line-clamp-2 sm:line-clamp-3 drop-shadow-xs max-w-md">
                  {currentSlide.subtitle}
                </p>

                {/* Sourcing Stat Highlight */}
                {currentSlide.stat && (
                  <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10">
                    <span className="text-sm sm:text-base font-black text-amber-300">
                      {currentSlide.stat}
                    </span>
                    <span className="text-[10px] sm:text-xs text-white/80 font-medium">
                      • {currentSlide.statLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Actions & Slider Controls */}
              <div className="flex items-center justify-between pt-2 z-10">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    if (currentSlide.slug) {
                      navigate(`/category/${currentSlide.slug}?experience=wholesale`);
                    } else {
                      navigate("/search?experience=wholesale&sort=popular");
                    }
                  }}
                  rightIcon={<FiChevronRight className="text-xs" />}
                  className="!py-2.5 !px-5 text-xs font-black shadow-lg bg-amber-400 hover:bg-amber-300 text-black border-none"
                >
                  {currentSlide.ctaText}
                </Button>

                {/* Carousel Dots */}
                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        activeSlide === idx ? "w-6 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            RIGHT COLUMN (Alibaba Buyer Sourcing Center & 1-Click RFQ Portal) - lg:col-span-3
            ═══════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3 bg-surface-card rounded-2xl border border-borderToken-default shadow-xs p-3.5 sm:p-4">

          {/* Buyer Greeting & Identity */}
          <div>
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-borderToken-default">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center font-black text-sm shrink-0">
                🏢
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-black text-textColor-primary truncate">
                  Buyer Sourcing Center
                </h4>
                <p className="text-[10px] text-textColor-muted truncate">
                  Commercial & Bulk Procurement
                </p>
              </div>
            </div>

            {/* 1-Click RFQ Quick Launcher Box */}
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/20">
              <div className="flex items-center gap-1.5 mb-1 text-amber-600 font-black text-xs">
                <FiSend className="text-xs" />
                <span>One Request, Multiple Quotes</span>
              </div>
              <p className="text-[11px] text-textColor-secondary leading-snug">
                Post your custom quantity requirement and receive tailored FOB factory quotes within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => onOpenRfqModal?.()}
                className="mt-2.5 w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-black font-black text-xs shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span>Post Sourcing RFQ</span>
                <FiArrowRight className="text-xs" />
              </button>
            </div>
          </div>

          {/* Alibaba Trade Assurance Guarantees */}
          <div className="space-y-2 pt-1">
            <h5 className="text-[10px] font-black text-textColor-muted uppercase tracking-wider">
              Trade Assurance Guarantee
            </h5>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-textColor-secondary">
                <FiShield className="text-emerald-500 text-sm shrink-0" />
                <span className="font-semibold text-textColor-primary">100% Payment Escrow</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-textColor-secondary">
                <FiClock className="text-blue-500 text-sm shrink-0" />
                <span className="font-semibold text-textColor-primary">On-Time Cargo Dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-textColor-secondary">
                <FiFileText className="text-purple-500 text-sm shrink-0" />
                <span className="font-semibold text-textColor-primary">100% GST Tax ITC Invoices</span>
              </div>
            </div>
          </div>

          {/* Quick Procurement Action Badges */}
          <div className="pt-2 border-t border-borderToken-default/60 grid grid-cols-2 gap-1.5 text-center">
            <Link
              to="/search?experience=wholesale&sort=popular"
              className="p-1.5 rounded-lg bg-surface-background hover:bg-borderToken-light border border-borderToken-default text-[10px] font-bold text-textColor-secondary hover:text-textColor-primary transition-colors"
            >
              ⚡ Ready to Ship
            </Link>
            <Link
              to="/wholesale/categories"
              className="p-1.5 rounded-lg bg-surface-background hover:bg-borderToken-light border border-borderToken-default text-[10px] font-bold text-textColor-secondary hover:text-textColor-primary transition-colors"
            >
              📋 All Categories
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AlibabaHeroSourcingSection;
