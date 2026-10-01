import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiShoppingBag,
  FiBox,
  FiShield,
  FiTruck,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiPercent,
  FiClock,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import heroSlide1 from "../../../../../data/hero/slide1.png";
import heroSlide2 from "../../../../../data/hero/slide2.png";
import heroSlide3 from "../../../../../data/hero/slide3.png";
import heroSlide4 from "../../../../../data/hero/slide4.png";

const DEFAULT_SLIDES = [
  {
    id: 1,
    image: heroSlide1,
    badge: "Mega Shopping Festival",
    badgeColor: "bg-amber-400 text-black",
    headline: "Everything You Need. All in One Place.",
    subheadline:
      "From everyday grocery essentials to lifestyle fashion and electronics, experience a smarter way to shop with verified multi-vendors.",
    primaryCta: { label: "Shop Retail Deals", link: "/shop" },
    secondaryCta: { label: "Explore Wholesale", link: "/wholesale" },
    highlight: "Up to 60% OFF",
  },
  {
    id: 2,
    image: heroSlide2,
    badge: "B2B Wholesale Hub",
    badgeColor: "bg-blue-500 text-white",
    headline: "Direct Factory Sourcing & Bulk Wholesale Pricing",
    subheadline:
      "Empower your retail business with verified manufacturers, transparent quantity discount tiers, and guaranteed MOQ protection.",
    primaryCta: { label: "Explore Wholesale Hub", link: "/wholesale" },
    secondaryCta: { label: "Request a Bulk Quote", link: "/wholesale" },
    highlight: "Tiered MOQs",
  },
  {
    id: 3,
    image: heroSlide3,
    badge: "Curated Fashion & Lifestyle",
    badgeColor: "bg-rose-500 text-white",
    headline: "Trending Styles & Top Fashion Brands",
    subheadline:
      "Discover the latest collections across ethnic wear, western apparel, footwear, and designer accessories from verified Indian designers.",
    primaryCta: { label: "Shop Fashion", link: "/category/fashion" },
    secondaryCta: { label: "View Today's Deals", link: "/daily-deals" },
    highlight: "New Arrivals",
  },
  {
    id: 4,
    image: heroSlide4,
    badge: "Fast & Fresh Essentials",
    badgeColor: "bg-emerald-500 text-white",
    headline: "Daily Household, Groceries & Quick Picks",
    subheadline:
      "Stock up on fresh kitchen essentials, pantry staples, personal care, and home goods with same-day express delivery.",
    primaryCta: { label: "Shop Essentials", link: "/category/groceries" },
    secondaryCta: { label: "Flash Sale", link: "/flash-sale" },
    highlight: "Express Delivery",
  },
];

const TRUST_PILLARS = [
  {
    icon: FiTruck,
    title: "Express Pan-India Delivery",
    subtitle: "Fast shipping on 25k+ products",
  },
  {
    icon: FiShield,
    title: "100% Genuine & Verified",
    subtitle: "Direct from verified suppliers",
  },
  {
    icon: FiBox,
    title: "B2B Wholesale & Retail",
    subtitle: "Dual shopping modes with MOQs",
  },
  {
    icon: FiPercent,
    title: "Best Value Guaranteed",
    subtitle: "Transparent tier pricing & deals",
  },
];

const HomeHeroSection = ({ customSlides = null }) => {
  const navigate = useNavigate();
  const slides = Array.isArray(customSlides) && customSlides.length > 0 ? customSlides : DEFAULT_SLIDES;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentSlideIndex] || slides[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#11243e] via-[#0d1c31] to-[#0a1525] py-4 sm:py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6">
        {/* Main Hero Container */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 min-h-[420px] sm:min-h-[460px] lg:min-h-[500px] flex items-center bg-black/60">
          {/* Background Slide Image with Crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id || currentSlideIndex}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-0"
            >
              <img
                src={current.image}
                alt={current.headline || "Dwell Mart Hero"}
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle multi-layer gradient overlays for readability and luxury mood */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b1728]/95 via-[#0b1728]/80 to-transparent sm:w-3/4" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1728] via-transparent to-black/30" />
            </motion.div>
          </AnimatePresence>

          {/* Foreground Hero Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-2xl text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id || currentSlideIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Promo Badge */}
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${
                      current.badgeColor || "bg-amber-400 text-black"
                    }`}
                  >
                    <FiCheckCircle className="text-xs" />
                    <span>{current.badge || "Verified Platform"}</span>
                  </span>
                  {current.highlight && (
                    <span className="text-xs font-bold text-amber-300 bg-black/50 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                      {current.highlight}
                    </span>
                  )}
                </div>

                {/* Main Headline */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] drop-shadow-md text-white">
                  {current.headline || "Everything You Need. All in One Place."}
                </h1>

                {/* Subheadline */}
                <p className="text-xs sm:text-sm lg:text-base text-gray-300 font-normal leading-relaxed line-clamp-3 max-w-xl">
                  {current.subheadline ||
                    "From everyday essentials to exciting discoveries, experience a smarter way to shop."}
                </p>

                {/* Dual Call To Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                  {current.primaryCta && (
                    <Link
                      to={current.primaryCta.link || "/shop"}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                      <FiShoppingBag className="text-sm sm:text-base" />
                      <span>{current.primaryCta.label || "Shop Now"}</span>
                      <FiArrowRight className="text-xs sm:text-sm" />
                    </Link>
                  )}

                  {current.secondaryCta && (
                    <Link
                      to={current.secondaryCta.link || "/wholesale"}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/25 backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                      <FiBox className="text-sm sm:text-base text-amber-400" />
                      <span>{current.secondaryCta.label || "Explore Wholesale"}</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/80 text-white/90 hover:text-white flex items-center justify-center border border-white/15 backdrop-blur-sm transition-all cursor-pointer"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="text-lg sm:text-xl" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/80 text-white/90 hover:text-white flex items-center justify-center border border-white/15 backdrop-blur-sm transition-all cursor-pointer"
            aria-label="Next slide"
          >
            <FiChevronRight className="text-lg sm:text-xl" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentSlideIndex === idx
                    ? "w-7 h-2 bg-amber-400"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 4 Trust Value Pillars Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 mt-3 sm:mt-4">
          {TRUST_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 hover:border-amber-400/30 rounded-xl p-3 sm:p-3.5 flex items-center gap-3 transition-colors backdrop-blur-sm group"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center shrink-0 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                  <Icon className="text-base sm:text-lg" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs sm:text-[13px] text-white truncate">
                    {pillar.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
