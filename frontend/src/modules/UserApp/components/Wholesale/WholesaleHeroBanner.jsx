import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBox,
  FiTruck,
  FiFileText,
  FiPercent,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
  FiCheckCircle
} from "react-icons/fi";
import LazyImage from "../../../../shared/components/LazyImage";
import api from "../../../../shared/utils/api";
import factoryBanner from "../../../../assets/wholesale/factory_banner.jpg";
import textilesBanner from "../../../../assets/wholesale/textiles_banner.jpg";
import electronicsBanner from "../../../../assets/wholesale/electronics_banner.jpg";

const DEFAULT_WHOLESALE_SLIDES = [
  {
    id: "ws-slide-1",
    image: factoryBanner,
    title: "Direct Factory Wholesale Sourcing",
    subtitle: "Connect directly with verified Indian manufacturers & distributors. Enjoy automatic volume pricing tiers.",
    cta: "Source Factory Direct",
    link: "/wholesale/categories",
    badge: "Direct Factory Lots",
  },
  {
    id: "ws-slide-2",
    image: textilesBanner,
    title: "Apparel, Fabrics & Garments Hub",
    subtitle: "Direct mill inventory & tiered wholesale volume slabs for bulk buyers, retailers, and boutique owners.",
    cta: "Explore Textiles & Apparel",
    link: "/wholesale/categories",
    badge: "Certified Indian Mills",
  },
  {
    id: "ws-slide-3",
    image: electronicsBanner,
    title: "Industrial Tools, Hardware & Tech",
    subtitle: "Heavy-duty machinery, precision components, tools & wholesale electronics with full GST ITC invoices.",
    cta: "Browse Industrial Catalog",
    link: "/wholesale/categories",
    badge: "Pallet & Carton Lots",
  },
];

const WholesaleHeroBanner = ({ banners = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Combine backend banners (if configured by admin) with premium curated wholesale slides
  const activeSlides = banners.length > 0
    ? banners.map((b, i) => ({
        id: b._id || `ws-banner-${i}`,
        image: b.image || DEFAULT_WHOLESALE_SLIDES[i % DEFAULT_WHOLESALE_SLIDES.length].image,
        title: b.title || DEFAULT_WHOLESALE_SLIDES[i % DEFAULT_WHOLESALE_SLIDES.length].title,
        subtitle: b.subtitle || b.description || DEFAULT_WHOLESALE_SLIDES[i % DEFAULT_WHOLESALE_SLIDES.length].subtitle,
        cta: b.buttonText || "Source Bulk Deals",
        link: b.link || "/wholesale/categories",
        badge: b.badge || "Factory Direct",
      }))
    : DEFAULT_WHOLESALE_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  return (
    <div className="w-full my-3 sm:my-4">
      {/* Wholesale Store Hero Banner Container */}
      <div className="relative w-full h-[230px] sm:h-[340px] md:h-[420px] lg:h-[480px] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-950 shadow-xl border border-amber-500/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <LazyImage
              src={activeSlides[currentSlide].image}
              alt={activeSlides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay for text contrast and premium feel */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>

        {/* Slide Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-5 sm:px-10 md:px-14 lg:px-20 max-w-2xl text-white">
          <motion.div
            key={`ws-content-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Storefront badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black bg-amber-400 text-black mb-2 sm:mb-3 shadow-md">
              <FiBox className="text-xs stroke-[2.5]" />
              <span>Dwell Mart Wholesale Hub (B2B)</span>
              <span className="opacity-40">•</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider">{activeSlides[currentSlide].badge}</span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-2 sm:mb-3 drop-shadow-md text-white">
              {activeSlides[currentSlide].title}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-gray-200 font-medium mb-4 sm:mb-6 line-clamp-2 max-w-xl drop-shadow-xs">
              {activeSlides[currentSlide].subtitle}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to={activeSlides[currentSlide].link}
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 transition-all shadow-lg transform hover:-translate-y-0.5"
              >
                <span>{activeSlides[currentSlide].cta}</span>
                <FiArrowRight className="text-sm" />
              </Link>

              <Link
                to="/wholesale/categories"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-all border border-white/20"
              >
                <FiLayers className="text-sm" />
                <span>Browse All Wholesale Departments</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Carousel Slide Indicators */}
        <div className="absolute bottom-4 left-5 sm:left-10 md:left-14 lg:left-20 z-20 flex items-center gap-2">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? "w-8 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Left / Right Nav Arrows (Desktop) */}
        <div className="hidden md:flex absolute right-6 bottom-6 z-20 items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-amber-400 hover:text-black transition-all flex items-center justify-center border border-white/20 cursor-pointer"
            aria-label="Previous Slide"
          >
            <FiChevronLeft className="text-lg" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-amber-400 hover:text-black transition-all flex items-center justify-center border border-white/20 cursor-pointer"
            aria-label="Next Slide"
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      </div>

      {/* 4-Pillar Wholesale Trust & Standards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-3 sm:mt-4">
        <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-surface-card border border-border/70 shadow-2xs hover:border-amber-400/40 transition-colors">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-400/20">
            <FiBox className="text-base sm:text-lg" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-textColor-primary leading-tight">Direct Factory Rates</h4>
            <p className="text-[10px] sm:text-xs text-textColor-muted">Zero middleman margins</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-surface-card border border-border/70 shadow-2xs hover:border-emerald-500/40 transition-colors">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <FiPercent className="text-base sm:text-lg" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-textColor-primary leading-tight">Tiered Bulk Slabs</h4>
            <p className="text-[10px] sm:text-xs text-textColor-muted">Deeper savings with volume</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-surface-card border border-border/70 shadow-2xs hover:border-blue-500/40 transition-colors">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
            <FiFileText className="text-base sm:text-lg" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-textColor-primary leading-tight">100% GST Tax Invoices</h4>
            <p className="text-[10px] sm:text-xs text-textColor-muted">Full input tax credit (ITC)</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-surface-card border border-border/70 shadow-2xs hover:border-purple-500/40 transition-colors">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 border border-purple-500/20">
            <FiTruck className="text-base sm:text-lg" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-textColor-primary leading-tight">Doorstep Bulk Freight</h4>
            <p className="text-[10px] sm:text-xs text-textColor-muted">Surface & pallet logistics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WholesaleHeroBanner);
