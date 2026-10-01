import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiCreditCard,
  FiShoppingBag,
  FiArrowRight,
  FiPercent,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import LazyImage from "../../../../shared/components/LazyImage";
import heroSlide1 from "../../../../../data/hero/slide1.png";
import heroSlide2 from "../../../../../data/hero/slide2.png";
import heroSlide3 from "../../../../../data/hero/slide3.png";
import heroSlide4 from "../../../../../data/hero/slide4.png";

const DEFAULT_SLIDES = [
  {
    id: "slide-1",
    image: heroSlide1,
    title: "Festive Retail Collection",
    subtitle: "Up to 60% OFF on Top Brands & Designer Wear",
    cta: "Shop Collection",
    link: "/category/6ab4d3186fedc375437ac882", // Fashion & Lifestyle
  },
  {
    id: "slide-2",
    image: heroSlide2,
    title: "Next-Gen Electronics & Mobiles",
    subtitle: "Latest Smartphones, Laptops & Smart Audio Gear",
    cta: "Explore Tech",
    link: "/category/6ab4d3186fedc375437ac887", // Electronics & Mobiles
  },
  {
    id: "slide-3",
    image: heroSlide3,
    title: "Designer Footwear & Lifestyle",
    subtitle: "Premium Footwear for Men, Women & Kids",
    cta: "Discover Styles",
    link: "/category/6abcc2cd4d4837d1a79a6e96", // Footwear
  },
  {
    id: "slide-4",
    image: heroSlide4,
    title: "Elevate Your Home & Living",
    subtitle: "Cookware, Smart Appliances & Elegant Home Decor",
    cta: "Upgrade Home",
    link: "/category/6ab4d3186fedc375437ac889", // Home & Kitchen
  },
];

const RetailHeroBanner = ({ banners = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Combine backend banners with default slides
  const activeSlides = banners.length > 0
    ? banners.map((b, i) => ({
        id: b._id || `banner-${i}`,
        image: b.image || DEFAULT_SLIDES[i % DEFAULT_SLIDES.length].image,
        title: b.title || DEFAULT_SLIDES[i % DEFAULT_SLIDES.length].title,
        subtitle: b.subtitle || b.description || DEFAULT_SLIDES[i % DEFAULT_SLIDES.length].subtitle,
        cta: "Shop Now",
        link: b.link || "/retail#retail-categories",
      }))
    : DEFAULT_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  return (
    <div className="w-full my-3 sm:my-4">
      {/* Retail Store Hero Banner Container */}
      <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[460px] rounded-2xl md:rounded-3xl overflow-hidden bg-slate-950 shadow-xl border border-border/40">
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
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-5 sm:px-10 md:px-14 lg:px-20 max-w-2xl text-white">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black bg-amber-400 text-black mb-2 sm:mb-3 shadow-sm">
              <FiShoppingBag className="text-xs" />
              <span>Dwell Mart Retail Store (B2C)</span>
            </div>

            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-2 sm:mb-3 drop-shadow-md">
              {activeSlides[currentSlide].title}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-gray-200 font-medium mb-4 sm:mb-6 line-clamp-2 max-w-xl drop-shadow-xs">
              {activeSlides[currentSlide].subtitle}
            </p>

            <div className="flex items-center gap-3">
              <Link
                to={activeSlides[currentSlide].link}
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 transition-all shadow-lg transform hover:-translate-y-0.5"
              >
                <span>{activeSlides[currentSlide].cta}</span>
                <FiArrowRight className="text-sm" />
              </Link>

              <a
                href="#retail-categories"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-all border border-white/20"
              >
                Browse All 25 Categories
              </a>
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
              className={`h-1.5 rounded-full transition-all duration-300 ${
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
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-amber-400 hover:text-black transition-all flex items-center justify-center border border-white/20"
            aria-label="Previous Slide"
          >
            <FiChevronLeft className="text-lg" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-amber-400 hover:text-black transition-all flex items-center justify-center border border-white/20"
            aria-label="Next Slide"
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      </div>

      {/* 4-Pillar Retail Trust Props */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-3 sm:mt-4">
        <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-surface-card border border-border/70 shadow-2xs">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-400/20">
            <FiTruck className="text-base sm:text-lg" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-textColor-primary leading-tight">Pan-India Express</h4>
            <p className="text-[10px] sm:text-xs text-textColor-muted">DTDC tracked courier</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-surface-card border border-border/70 shadow-2xs">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <FiShield className="text-base sm:text-lg" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-textColor-primary leading-tight">100% Genuine</h4>
            <p className="text-[10px] sm:text-xs text-textColor-muted">Verified Indian sellers</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-surface-card border border-border/70 shadow-2xs">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
            <FiRotateCcw className="text-base sm:text-lg" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-textColor-primary leading-tight">7-Day Easy Returns</h4>
            <p className="text-[10px] sm:text-xs text-textColor-muted">Hassle-free guarantee</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 p-3 rounded-2xl bg-surface-card border border-border/70 shadow-2xs">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 border border-purple-500/20">
            <FiCreditCard className="text-base sm:text-lg" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-textColor-primary leading-tight">Cash on Delivery</h4>
            <p className="text-[10px] sm:text-xs text-textColor-muted">UPI, Cards & NetBanking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RetailHeroBanner);
