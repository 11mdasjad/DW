import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, matchPath, useNavigate } from "react-router-dom";
import { FiHeart, FiTruck, FiRotateCcw, FiShield, FiCheckCircle, FiUsers, FiBox, FiGrid, FiLock, FiShoppingBag, FiArrowRight, FiZap, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import MobileLayout from "../components/Layout/MobileLayout";
import ProductCard from "../../../shared/components/ProductCard";
import AnimatedBanner from "../components/Mobile/AnimatedBanner";
import NewArrivalsSection from "../components/Mobile/NewArrivalsSection";
import DailyDealsSection from "../components/Mobile/DailyDealsSection";
import RecommendedSection from "../components/Mobile/RecommendedSection";
import FeaturedVendorsSection from "../components/Mobile/FeaturedVendorsSection";
import BrandLogosScroll from "../components/Mobile/BrandLogosScroll";
import MobileCategoryGrid from "../components/Mobile/MobileCategoryGrid";
import ConfidenceSection from "../components/Mobile/ConfidenceSection";
import MarketplaceTrustSection from "../components/Mobile/MarketplaceTrustSection";
import TestimonialsSection from "../components/Mobile/TestimonialsSection";
import LazyImage from "../../../shared/components/LazyImage";
import {
  getApprovedVendors,
  getCatalogBrands,
} from "../data/catalogData";
import { DEFAULT_HOME_SECTIONS, selectHomeSections } from "../data/homeSections";
import PageTransition from "../../../shared/components/PageTransition";
import usePullToRefresh from "../hooks/usePullToRefresh";
import toast from "react-hot-toast";
import api from "../../../shared/utils/api";
import { usePageTranslation } from "../../../hooks/usePageTranslation";
import { useDynamicTranslation } from "../../../hooks/useDynamicTranslation";
import heroSlide1 from "../../../../data/hero/slide1.png";
import heroSlide2 from "../../../../data/hero/slide2.png";
import heroSlide3 from "../../../../data/hero/slide3.png";
import heroSlide4 from "../../../../data/hero/slide4.png";
import stylishWatchImg from "../../../../data/products/stylish watch.png";
import dwellmartHeroBg from "../../../../data/hero/dwellmart_hero_bg.jpg";
import { getImageUrl, calculateDiscount, getPlaceholderImage } from "../../../shared/utils/helpers";
import ExperienceSwitcher from "../components/QuickCommerce/ExperienceSwitcher";

const normalizeId = (value) => String(value ?? "").trim();
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeProduct = (raw) => {
  if (!raw) return null;
  const vendorObj =
    raw?.vendor && typeof raw.vendor === "object"
      ? raw.vendor
      : raw?.vendorId && typeof raw.vendorId === "object"
        ? raw.vendorId
        : null;
  const brandObj =
    raw?.brand && typeof raw.brand === "object"
      ? raw.brand
      : raw?.brandId && typeof raw.brandId === "object"
        ? raw.brandId
        : null;
  const categoryObj =
    raw?.category && typeof raw.category === "object"
      ? raw.category
      : raw?.categoryId && typeof raw.categoryId === "object"
        ? raw.categoryId
        : null;

  const id = normalizeId(raw?.id || raw?._id);
  const vendorId = normalizeId(vendorObj?._id || vendorObj?.id || raw?.vendorId);
  const brandId = normalizeId(brandObj?._id || brandObj?.id || raw?.brandId);
  const categoryId = normalizeId(
    categoryObj?._id || categoryObj?.id || raw?.categoryId
  );
  const rawImage = raw?.image || raw?.mainImage || raw?.thumbnail || raw?.images?.[0] || "";
  const image = getImageUrl(rawImage);
  const images = (Array.isArray(raw?.images) ? raw.images : [rawImage])
    .filter(Boolean)
    .map(img => getImageUrl(img));

  const price = toNumber(raw?.price, 0);
  const originalPrice = raw?.originalPrice !== undefined ? toNumber(raw.originalPrice, undefined) : undefined;
  const validOriginalPrice = originalPrice && originalPrice > price ? originalPrice : undefined;

  return {
    ...raw,
    id,
    _id: id,
    vendorId,
    vendor: vendorObj ? normalizeVendor(vendorObj) : null,
    vendorName: raw?.vendorName || vendorObj?.storeName || vendorObj?.name || "",
    brandId,
    brand: brandObj ? normalizeBrand(brandObj) : null,
    brandName: raw?.brandName || brandObj?.name || "",
    categoryId,
    categoryName: raw?.categoryName || categoryObj?.name || "",
    image,
    images,
    price,
    originalPrice: validOriginalPrice,
    rating: toNumber(raw?.rating, 0),
    reviewCount: toNumber(raw?.reviewCount, 0),
    isActive: raw?.isActive !== false,
    flashSale: !!raw?.flashSale,
    isNew: !!raw?.isNewArrival,
  };
};

const normalizeVendor = (raw) => {
  const id = normalizeId(raw?.id || raw?._id);
  return {
    ...raw,
    id,
    _id: id,
    storeLogo: getImageUrl(raw?.storeLogo || raw?.logo || raw?.image),
    isVerified: !!raw?.isVerified,
    rating: toNumber(raw?.rating, 0),
    reviewCount: toNumber(raw?.reviewCount, 0),
    status: raw?.status || "approved",
  };
};

const normalizeBrand = (raw) => {
  const id = normalizeId(raw?.id || raw?._id);
  return {
    ...raw,
    id,
    _id: id,
    name: raw?.name || "",
    logo: getImageUrl(raw?.logo || raw?.image || raw?.brandLogo),
  };
};

const normalizeTestimonial = (raw) => ({
  ...raw,
  id: normalizeId(raw?.id || raw?._id),
  _id: normalizeId(raw?.id || raw?._id),
  name: raw?.name || "",
  designation: raw?.designation || "",
  company: raw?.company || "",
  message: raw?.message || "",
  image: raw?.image || "",
  rating: toNumber(raw?.rating, 5),
  order: toNumber(raw?.order, 0),
  isActive: raw?.isActive !== false,
});

const DEFAULT_HERO_SLIDES = [
  { image: heroSlide1 },
  { image: heroSlide2 },
  { image: heroSlide3 },
  { image: heroSlide4 },
];

const extractResponseData = (response) => {
  if (response && typeof response === "object") {
    if (Object.prototype.hasOwnProperty.call(response, "data")) {
      return response.data;
    }
    return response;
  }
  return null;
};

const asList = (value) => (Array.isArray(value) ? value : []);
const KNOWN_USER_ROUTE_PATTERNS = [
  "/",
  "/home",
  "/shop",
  "/search",
  "/offers",
  "/daily-deals",
  "/flash-sale",
  "/new-arrivals",
  "/categories",
  "/category/:id",
  "/brand/:id",
  "/brands",
  "/seller/:id",
  "/sellers",
  "/vendors",
  "/product/:id",
  "/sale/:slug",
  "/quick-commerce",
  "/sell-on-dwellmart",
  "/shop-with-confidence",
  "/track-order/:orderId",
];

const getPathnameFromTarget = (target) =>
  String(target || "").trim().split("?")[0].split("#")[0];

const isKnownInternalRoute = (target) => {
  const pathname = getPathnameFromTarget(target);
  if (!pathname) return false;
  return KNOWN_USER_ROUTE_PATTERNS.some((pattern) =>
    !!matchPath({ path: pattern, end: true }, pathname)
  );
};

const resolveBannerLink = (banner) => {
  const candidate = String(
    banner?.linkUrl || banner?.link || banner?.url || ""
  ).trim();
  if (!candidate) return "";
  if (isExternalLink(candidate)) return candidate;
  if (isSafeInternalPath(candidate) && isKnownInternalRoute(candidate))
    return candidate;
  return "";
};

const isExternalLink = (target) => /^https?:\/\//i.test(String(target || "").trim());
const isSafeInternalPath = (target) => String(target || "").startsWith("/");

const MobileHome = () => {
  const navigate = useNavigate();
  const { translateObject, translateArray } = useDynamicTranslation();
  const { getTranslatedText: t } = usePageTranslation([
    "PREMIUM",
    "Exclusive Collection",
    "Shop Now",
    "Explore Deals",
    "Elevate Your Style",
    "Most Popular",
    "See All",
    "Flash Sale",
    "Limited time offers",
    "Trending Now",
    "MARKETPLACE TRUST & ASSURANCE",
    "Why Shop With Dwell Mart?",
    "We partner with top-rated sellers to guarantee authentic products, transparent pricing, and instant support.",
    "Free Express Shipping",
    "On all orders over ₹499 nationwide",
    "7-Day Easy Returns",
    "Hassle-free 100% money back guarantee",
    "100% Secure Payments",
    "Encrypted checkout via UPI, Cards & NetBanking",
    "Verified Marketplace Sellers",
    "Quality-vetted vendors across India",
    "VERIFIED STORES",
    "CURATED PRODUCTS",
    "CATEGORIES",
    "SECURE PAYMENTS",
    "Refresh failed. Showing available data.",
    "Refreshed",
    "Special Offer",
    "Limited Time"
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [autoSlidePaused, setAutoSlidePaused] = useState(false);
  const [isDraggingSlide, setIsDraggingSlide] = useState(false);
  const [slides, setSlides] = useState(DEFAULT_HERO_SLIDES);
  const [promoBanners, setPromoBanners] = useState([]);
  const [sideBanner, setSideBanner] = useState(null);
  const [selectedSections, setSelectedSections] = useState(() => selectHomeSections({}));
  const [homeSectionConfig, setHomeSectionConfig] = useState(DEFAULT_HOME_SECTIONS);
  const [catalogTotal, setCatalogTotal] = useState(0);
  const [homeVendors, setHomeVendors] = useState([]);
  const [homeBrands, setHomeBrands] = useState([]);
  const [homeTestimonials, setHomeTestimonials] = useState([]);

  const fallbackVendors = getApprovedVendors();
  const fallbackBrands = getCatalogBrands().slice(0, 10);

  const computedNewArrivals = selectedSections.newArrivals;
  const computedDailyDeals = selectedSections.dailyDeals;
  const computedRecommended = selectedSections.recommended;
  const computedMostPopular = selectedSections.mostPopular;
  const computedTrending = selectedSections.trending;
  const computedFlashSale = selectedSections.flashSale;

  const sectionProducts = {
    newArrivals: computedNewArrivals,
    mostPopular: computedMostPopular,
    dailyDeals: computedDailyDeals,
    flashSale: computedFlashSale,
    trending: computedTrending,
    recommended: computedRecommended,
  };

  const sectionLinks = {
    newArrivals: "/new-arrivals",
    mostPopular: "/search?sort=popular",
    dailyDeals: "/daily-deals",
    flashSale: "/flash-sale",
    trending: "/search?sort=rating",
    recommended: "/search?sort=rating",
  };

  const renderHomepageSection = (section) => {
    const products = sectionProducts[section.key] || [];
    if (!section.enabled || products.length === 0) return null;
    if (section.key === "newArrivals") {
      return <NewArrivalsSection key={section.key} products={products} title={section.title} subtitle={section.subtitle} />;
    }
    if (section.key === "dailyDeals") {
      return <DailyDealsSection key={section.key} products={products} title={section.title} subtitle={section.subtitle} />;
    }
    if (section.key === "recommended") {
      return <RecommendedSection key={section.key} products={products} title={section.title} subtitle={section.subtitle} />;
    }
    const isFlashSale = section.key === "flashSale";
    return (
      <div key={section.key} className={isFlashSale ? "px-4 py-4 bg-surface-muted border-y border-border" : "px-4 py-4"}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-content">{t(section.title)}</h2>
            {section.subtitle && <p className="text-xs text-content-secondary">{t(section.subtitle)}</p>}
          </div>
          <Link to={sectionLinks[section.key]} className="text-sm text-brand-primary font-semibold hover:underline">
            {t("See All")}
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {products.map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <ProductCard product={product} isFlashSale={isFlashSale} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const computedVendors = useMemo(() => {
    if (homeVendors.length === 0) return fallbackVendors;
    return [...homeVendors]
      .filter((vendor) => vendor.status === "approved")
      .sort((a, b) => toNumber(b.rating, 0) - toNumber(a.rating, 0))
      .slice(0, 10);
  }, [homeVendors, fallbackVendors]);

  const computedBrands = useMemo(() => {
    if (homeBrands.length === 0) return fallbackBrands;
    return homeBrands;
  }, [homeBrands, fallbackBrands]);

  const fetchHomeData = useCallback(async () => {
    try {
      const [newRes, dealsRes, flashRes, popularRes, ratedRes, vendorsRes, brandsRes, bannersRes, testimonialsRes, sectionsRes] =
        await Promise.allSettled([
          api.get("/new-arrivals", { params: { page: 1, limit: 36 } }),
          api.get("/daily-deals"),
          api.get("/flash-sale"),
          api.get("/products", { params: { page: 1, limit: 48, sort: "popular" } }),
          api.get("/products", { params: { page: 1, limit: 72, sort: "rating" } }),
          api.get("/vendors/best-sellers", {
            params: { limit: 8 },
          }),
          api.get("/brands/all"),
          api.get("/banners"),
          api.get("/testimonials"),
          api.get("/homepage/sections"),
        ]);

      const productPayload = (result) => result.status === "fulfilled"
        ? extractResponseData(result.value)
        : null;
      const newPayload = productPayload(newRes);
      const popularPayload = productPayload(popularRes);
      const ratedPayload = productPayload(ratedRes);
      const sourceList = (payload) => asList(payload?.products ?? payload);
      const normalizeProducts = (payload) => sourceList(payload)
        .map(normalizeProduct)
        .filter((product) => product?.id && product.isActive !== false);
      const topRated = normalizeProducts(ratedPayload);
      const sectionsPayload = productPayload(sectionsRes);
      const config = Array.isArray(sectionsPayload?.sections) ? sectionsPayload.sections : DEFAULT_HOME_SECTIONS;
      const pinned = Object.fromEntries(config.map((section) => [section.key,
        normalizeProducts(sectionsPayload?.pinnedProducts?.[section.key]),
      ]));
      const selected = selectHomeSections({
        newArrivals: normalizeProducts(newPayload),
        dailyDeals: normalizeProducts(productPayload(dealsRes)),
        flashSale: normalizeProducts(productPayload(flashRes)),
        mostPopular: normalizeProducts(popularPayload),
        trending: topRated,
        recommended: topRated,
      }, config, pinned);
      const translated = await translateArray(Object.values(selected).flat(), ["name", "description"]);
      const translatedById = new Map(translated.map((product) => [product.id, product]));
      setSelectedSections(Object.fromEntries(
        Object.entries(selected).map(([section, products]) => [
          section,
          products.map((product) => translatedById.get(product.id) || product),
        ])
      ));
      setHomeSectionConfig(config);
      setCatalogTotal(toNumber(popularPayload?.total, 0));

      if (vendorsRes.status === "fulfilled") {
        const payload = extractResponseData(vendorsRes.value);
        const vendorsSource = asList(payload?.vendors);
        const normalizedVendors = vendorsSource
          .map(normalizeVendor)
          .filter((vendor) => vendor.id);
        
        // Dynamic Translation for Vendors
        const translatedVendors = await Promise.all(
          normalizedVendors.map(v => translateObject(v, ['storeName', 'description']))
        );
        setHomeVendors(translatedVendors);
      }

      if (brandsRes.status === "fulfilled") {
        const payload = extractResponseData(brandsRes.value);
        const brandsSource = asList(payload);
        const normalizedBrands = brandsSource
          .map(normalizeBrand)
          .filter((brand) => brand.id);
        
        // Dynamic Translation for Brands
        const translatedBrands = await Promise.all(
          normalizedBrands.map(b => translateObject(b, ['name']))
        );
        setHomeBrands(translatedBrands);
      }

      if (bannersRes.status === "fulfilled") {
        const payload = extractResponseData(bannersRes.value);
        const allBanners = asList(payload).filter(
          (banner) => banner?.image && banner?.isActive !== false
        );

        // Dynamic Translation for Banners
        const translatedBanners = await Promise.all(
          allBanners.map(b => translateObject(b, ['title', 'subtitle', 'description']))
        );

        const bannerSlides = translatedBanners
          .filter((banner) =>
            ["home_slider", "hero"].includes(String(banner?.type || ""))
          )
          .sort((a, b) => toNumber(a.order, 0) - toNumber(b.order, 0))
          .map((banner, index) => ({
            id: normalizeId(banner._id || banner.id || `home-slide-${index}`),
            image: banner.image,
            link: resolveBannerLink(banner),
            title: banner.title || "",
            subtitle: banner.subtitle || "",
            description: banner.description || "",
          }));
        setSlides(bannerSlides.length > 0 ? bannerSlides : DEFAULT_HERO_SLIDES);

        const banners = translatedBanners
          .filter((banner) => String(banner?.type || "") === "promotional")
          .sort((a, b) => toNumber(a.order, 0) - toNumber(b.order, 0))
          .map((banner, index) => ({
            id: normalizeId(banner._id || banner.id || `promo-banner-${index}`),
            title: banner.title || "Special Offer",
            subtitle: banner.subtitle || "Limited Time",
            description: banner.description || "",
            discount: banner.description || "Shop Now",
            link: resolveBannerLink(banner),
            image: banner.image,
            type: banner.type || "promotional",
          }));
        setPromoBanners(banners);

        const mapped = translatedBanners
          .filter((banner) => String(banner?.type || "") === "side_banner")
          .sort((a, b) => toNumber(a.order, 0) - toNumber(b.order, 0))
          .map((banner, index) => ({
            id: normalizeId(banner._id || banner.id || `side-banner-${index}`),
            image: banner.image,
            title: banner.title || "PREMIUM",
            subtitle: banner.subtitle || "Exclusive Collection",
            link: resolveBannerLink(banner),
          }));
        setSideBanner(mapped[0] || null);
      } else {
        setSlides(DEFAULT_HERO_SLIDES);
        setPromoBanners([]);
        setSideBanner(null);
      }

      if (testimonialsRes.status === "fulfilled") {
        const payload = extractResponseData(testimonialsRes.value);
        const testimonialsSource = asList(payload);
        const normalizedTestimonials = testimonialsSource
          .map(normalizeTestimonial)
          .filter((testimonial) => testimonial.id && testimonial.isActive)
          .sort((a, b) => toNumber(a.order, 0) - toNumber(b.order, 0));
        
        // Dynamic Translation for Testimonials
        const translatedTestimonials = await Promise.all(
          normalizedTestimonials.map(t => translateObject(t, ['name', 'designation', 'company', 'message']))
        );
        setHomeTestimonials(translatedTestimonials);
      } else {
        setHomeTestimonials([]);
      }
      return true;
    } catch {
      return false;
    }
  }, [translateObject, translateArray]);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // Auto-slide functionality (pauses when user is dragging)
  useEffect(() => {
    if (autoSlidePaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, autoSlidePaused]);

  // Minimum swipe distance (in pixels) to trigger slide change
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    e.stopPropagation(); // Prevent pull-to-refresh from interfering
    setTouchEnd(null);
    setIsDraggingSlide(false);
    const touch = e.targetTouches[0];
    setTouchStart(touch.clientX);
    setDragOffset(0);
    setAutoSlidePaused(true);
  };

  const onTouchMove = (e) => {
    if (touchStart === null) return;
    e.stopPropagation(); // Prevent pull-to-refresh from interfering
    const touch = e.targetTouches[0];
    const currentX = touch.clientX;
    // Calculate difference: positive when swiping left, negative when swiping right
    const diff = touchStart - currentX;
    if (Math.abs(diff) > 8) {
      setIsDraggingSlide(true);
    }
    // Constrain the drag offset to prevent over-dragging
    // Use container width for better responsiveness
    const containerWidth = e.currentTarget?.offsetWidth || 400;
    const maxDrag = containerWidth * 0.5; // Maximum drag distance (50% of container)
    // dragOffset: positive = swiping left (show next), negative = swiping right (show previous)
    setDragOffset(Math.max(-maxDrag, Math.min(maxDrag, diff)));
    setTouchEnd(currentX);
  };

  const onTouchEnd = (e) => {
    if (e) e.stopPropagation(); // Prevent pull-to-refresh from interfering

    if (touchStart === null) {
      setAutoSlidePaused(false);
      return;
    }

    // Calculate swipe distance: positive = left swipe, negative = right swipe
    const distance = touchStart - (touchEnd || touchStart);
    const isLeftSwipe = distance > minSwipeDistance; // Finger moved left = show next slide
    const isRightSwipe = distance < -minSwipeDistance; // Finger moved right = show previous slide

    if (isLeftSwipe) {
      // Swipe left (finger moved left) - go to next slide (slide moves left)
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else if (isRightSwipe) {
      // Swipe right (finger moved right) - go to previous slide (slide moves right)
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }

    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
    setDragOffset(0);

    // Resume auto-slide after a short delay
    setTimeout(() => {
      setAutoSlidePaused(false);
    }, 2000);
    setTimeout(() => {
      setIsDraggingSlide(false);
    }, 150);
  };

  const handleSlideClick = (slide) => {
    if (isDraggingSlide) return;
    const target = String(slide?.link || "").trim();
    if (!target) return;

    if (isExternalLink(target)) {
      window.open(target, "_blank", "noopener,noreferrer");
      return;
    }
    if (isSafeInternalPath(target)) {
      navigate(target);
    }
  };

  const handleBannerNavigation = (target) => {
    const normalizedTarget = String(target || "").trim();
    if (!normalizedTarget) return;
    if (isExternalLink(normalizedTarget)) {
      window.open(normalizedTarget, "_blank", "noopener,noreferrer");
      return;
    }
    if (isSafeInternalPath(normalizedTarget) && isKnownInternalRoute(normalizedTarget)) {
      navigate(normalizedTarget);
    }
  };

  // Pull to refresh handler
  const handleRefresh = async () => {
    await fetchHomeData();
  };

  const {
    pullDistance,
    isPulling,
    elementRef,
  } = usePullToRefresh(handleRefresh);

  return (
    <PageTransition>
      <MobileLayout>
        <div
          ref={elementRef}
          className="w-full"
          style={{
            transform: `translateY(${Math.min(pullDistance, 80)}px)`,
            transition: isPulling ? "none" : "transform 0.3s ease-out",
          }}>
          {/* ════════════════════════════════════════════════
               PREMIUM FULL-SCREEN HERO BANNER
               Pure CSS — no image dependency issues
          ════════════════════════════════════════════════ */}
          <div
            className="relative w-full overflow-hidden"
            style={{
              minHeight: "100vh",
              background: "linear-gradient(135deg, #020c1b 0%, #041226 30%, #061c14 65%, #030d0a 100%)",
            }}
          >
            {/* ── Decorative glowing orbs ── */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* Big emerald orb top-right */}
              <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #10b981 0%, transparent 70%)" }} />
              {/* Indigo orb bottom-left */}
              <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
              {/* Amber orb center */}
              <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "60px 60px"
                }} />
            </div>

            {/* ── Main content grid ── */}
            <div className="relative z-10 h-full min-h-screen flex items-center px-8 md:px-14 lg:px-20 xl:px-28">
              {/* Left side — text */}
              <div className="flex-1 flex flex-col justify-center py-20 max-w-2xl">

                {/* Live badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2.5 mb-6 w-fit"
                >
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Dwell Mart • India's #1 Marketplace</span>
                  </div>
                </motion.div>

                {/* Main headline */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.15 }}
                >
                  <h1 className="font-black leading-[1.05] tracking-tight mb-6"
                    style={{ fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)" }}>
                    <span className="text-white">Shop </span>
                    <span style={{
                      background: "linear-gradient(135deg, #34d399, #10b981, #059669)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}>Smarter,</span>
                    <br />
                    <span className="text-white">Live </span>
                    <span style={{
                      background: "linear-gradient(135deg, #a78bfa, #818cf8, #6366f1)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}>Better</span>
                  </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-slate-400 font-medium mb-10 leading-relaxed"
                  style={{ fontSize: "clamp(1rem, 1.6vw, 1.2rem)", maxWidth: "34rem" }}
                >
                  From groceries to gadgets, fashion to furniture —
                  discover millions of products at the best prices, delivered fast.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.42 }}
                  className="flex flex-wrap items-center gap-4 mb-12"
                >
                  <button
                    type="button"
                    onClick={() => navigate("/shop")}
                    className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-base text-white cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-95 shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      boxShadow: "0 8px 32px rgba(16,185,129,0.35), 0 0 0 1px rgba(16,185,129,0.2)"
                    }}
                  >
                    <FiShoppingBag className="text-lg shrink-0" />
                    <span>Shop Now</span>
                    <FiArrowRight className="text-base shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/new-arrivals")}
                    className="group flex items-center gap-3 px-7 py-4 rounded-2xl font-bold text-base text-white cursor-pointer transition-all duration-300 hover:-translate-y-1 active:scale-95"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.3)"
                    }}
                  >
                    <FiZap className="text-lg text-amber-400 shrink-0" />
                    <span>Explore Deals</span>
                    <FiArrowRight className="text-base shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </motion.div>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-wrap gap-8 pt-8"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {[
                    { value: "10M+", label: "Products" },
                    { value: "50K+", label: "Sellers" },
                    { value: "4.8★", label: "App Rating" },
                    { value: "24h", label: "Delivery" },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col">
                      <span className="text-white font-black text-xl">{value}</span>
                      <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right side — floating category cards grid */}
              <motion.div
                className="hidden lg:flex flex-col items-center justify-center flex-shrink-0 pl-12"
                style={{ width: "42%" }}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
              >
                {/* Category cards grid */}
                <div className="grid grid-cols-3 gap-4 w-full" style={{ maxWidth: "480px" }}>
                  {[
                    { emoji: "🛒", name: "Grocery", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
                    { emoji: "👗", name: "Fashion", color: "#f472b6", bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.25)" },
                    { emoji: "📱", name: "Electronics", color: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.25)" },
                    { emoji: "🏠", name: "Home", color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)" },
                    { emoji: "💄", name: "Beauty", color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.25)" },
                    { emoji: "🧸", name: "Toys", color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)" },
                    { emoji: "🏋️", name: "Sports", color: "#34d399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.25)" },
                    { emoji: "📚", name: "Books", color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.25)" },
                    { emoji: "🚗", name: "Automotive", color: "#38bdf8", bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.25)" },
                  ].map(({ emoji, name, color, bg, border }, i) => (
                    <motion.button
                      key={name}
                      type="button"
                      onClick={() => navigate("/shop")}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.35 + i * 0.06 }}
                      whileHover={{ scale: 1.06, y: -4 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex flex-col items-center justify-center gap-2 rounded-2xl py-5 px-3 cursor-pointer transition-shadow duration-300"
                      style={{
                        background: bg,
                        border: `1px solid ${border}`,
                        backdropFilter: "blur(16px)",
                        boxShadow: `0 4px 24px rgba(0,0,0,0.25)`,
                      }}
                    >
                      <span className="text-3xl leading-none">{emoji}</span>
                      <span className="text-xs font-bold text-center leading-tight" style={{ color }}>{name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Floating promo card below grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="mt-5 w-full rounded-2xl px-5 py-4 flex items-center gap-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(99,102,241,0.15))",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(20px)",
                    maxWidth: "480px",
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                    style={{ background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.3)" }}>
                    🎁
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-black text-sm">Free Delivery on ₹499+</p>
                    <p className="text-slate-400 text-xs mt-0.5">Across India • 50,000+ verified sellers</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-xs">★</span>)}
                    </div>
                    <span className="text-slate-500 text-[10px] mt-0.5">4.8 / 5.0</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Bottom trust bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
            >
              <div className="max-w-7xl mx-auto px-8 py-3.5 flex items-center justify-center gap-8 flex-wrap">
                {[
                  { icon: FiTruck, label: "Free Delivery on ₹499+" },
                  { icon: FiShield, label: "100% Secure Payments" },
                  { icon: FiRotateCcw, label: "7-Day Easy Returns" },
                  { icon: FiCheckCircle, label: "Authentic Products" },
                  { icon: FiZap, label: "Lightning Fast Delivery" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-slate-400 text-xs font-semibold whitespace-nowrap">
                    <Icon className="text-emerald-400 text-sm shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Experience Switcher / Toggle Section — positioned directly below Hero Banner */}
          <ExperienceSwitcher />

          {/* Brand Logos Scroll */}
          <BrandLogosScroll brands={computedBrands} />

          {/* Featured Vendors Section (Best Sellers) */}
          <FeaturedVendorsSection vendors={computedVendors} />

          {/* Shop With Confidence Section */}
          <ConfidenceSection />

          {/* Animated Banner */}
          <AnimatedBanner banners={promoBanners} />

          {/* Product rows are server-configured by the admin, while the existing
              source-specific See All routes and eligibility rules stay intact. */}
          {homeSectionConfig.map(renderHomepageSection)}

          {/* Marketplace Trust & Assurance Section */}
          <MarketplaceTrustSection
            vendorCount={computedVendors.length}
            productCount={catalogTotal}
          />

          <TestimonialsSection testimonials={homeTestimonials} />

          {/* Bottom Spacing */}
          <div className="h-4" />
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default MobileHome;
