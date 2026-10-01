import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiZap,
  FiPackage,
  FiChevronRight,
  FiTrendingUp,
  FiStar,
  FiClock,
  FiTruck,
  FiShield,
  FiCheckCircle,
  FiArrowRight,
  FiPercent,
  FiHeart,
  FiArrowLeft
} from "react-icons/fi";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import ProductCard from "../../../shared/components/ProductCard";
import ExperienceSwitcher from "../components/QuickCommerce/ExperienceSwitcher";
import RetailHeroBanner from "../components/Retail/RetailHeroBanner";
import RetailQuickCategoryRibbon from "../components/Retail/RetailQuickCategoryRibbon";
import RetailSearchBar from "../components/Retail/RetailSearchBar";
import { useCartStore, useUIStore } from "../../../shared/store/useStore";
import { Button } from "../../../shared/components/ui";
import { useCategoryStore } from "../../../shared/store/categoryStore";
import { useExperienceStore } from "../../../shared/store/experienceStore";
import { EXPERIENCES } from "../../../shared/utils/experience";
import api from "../../../shared/utils/api";

/**
 * Product shelf component with horizontal scroll and responsive 2-column mobile layout
 */
const RetailProductShelf = ({ title, subtitle, badge, badgeColor, products = [], isLoading = false, seeAllLink = "/shop" }) => {
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 my-6 sm:my-8">
      {/* Shelf Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          {badge && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1 ${badgeColor || "bg-amber-400/15 text-amber-600 border border-amber-400/30"}`}>
              {badge}
            </span>
          )}
          <h3 className="text-lg sm:text-2xl font-black text-textColor-primary tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-textColor-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {seeAllLink && (
          <Link
            to={seeAllLink}
            className="shrink-0 text-xs sm:text-sm font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1 transition-colors group"
          >
            <span>See All</span>
            <FiChevronRight className="text-sm transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* Product Grid / Row */}
      {isLoading ? (
        <div className="flex gap-3.5 overflow-x-auto scrollbar-hide py-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-[calc(50%-7px)] sm:w-52 md:w-60 h-72 sm:h-80 rounded-2xl bg-surface-card animate-pulse border border-border/60 shrink-0"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-3.5 overflow-x-auto scrollbar-hide py-1 snap-x snap-mandatory">
          {products.map((product) => (
            <div
              key={product._id || product.id}
              className="w-[calc(50%-7px)] sm:w-52 md:w-60 shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

/**
 * RetailHome (B2C Retail Store Dedicated Homepage)
 *
 * Fully dedicated Retail Store shopping experience:
 * - Dedicated B2C branding & indicators
 * - Complete 25-category showcase
 * - Quick category ribbon
 * - Real product shelves (trending, bestselling, new arrivals)
 * - Recently viewed shelf
 * - Seamless integration with existing cart, auth, and checkout
 */
const RetailHome = () => {
  const navigate = useNavigate();
  const { setExperience } = useExperienceStore();
  const { categories, getRootCategories, initialize } = useCategoryStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const toggleCart = useUIStore((state) => state.toggleCart);

  const [banners, setBanners] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestsellingProducts, setBestsellingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [fashionProducts, setFashionProducts] = useState([]);
  const [electronicsProducts, setElectronicsProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoadingShelves, setIsLoadingShelves] = useState(true);

  // Set experience to Marketplace on mount
  useEffect(() => {
    setExperience(EXPERIENCES.MARKETPLACE);
    initialize("marketplace");
  }, [setExperience, initialize]);

  // Load backend banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/banners");
        const list = res?.data || res || [];
        if (Array.isArray(list)) {
          setBanners(list.filter((b) => b.isActive !== false));
        }
      } catch {
        setBanners([]);
      }
    };
    fetchBanners();
  }, []);

  // Normalize product object
  const normalizeProduct = useCallback((raw) => {
    if (!raw) return null;
    const id = String(raw._id || raw.id || "").trim();
    const price = Number(raw.price) || 0;
    const originalPrice = raw.originalPrice !== undefined ? Number(raw.originalPrice) : undefined;
    const validOriginalPrice = originalPrice && originalPrice > price ? originalPrice : undefined;

    return {
      ...raw,
      id,
      _id: id,
      price,
      originalPrice: validOriginalPrice,
      rating: Number(raw.rating) || 0,
      reviewCount: Number(raw.reviewCount) || 0,
      image: raw.image || raw.images?.[0] || "",
      images: Array.isArray(raw.images) ? raw.images : [raw.image || ""].filter(Boolean),
      retailEnabled: true,
    };
  }, []);

  // Fetch product shelves
  useEffect(() => {
    let cancelled = false;

    const fetchShelves = async () => {
      setIsLoadingShelves(true);
      try {
        // Fetch trending/discounted products
        const trendingRes = await api.get("/products", {
          params: { page: 1, limit: 10, sort: "newest" },
        });
        const trendingList = trendingRes?.data?.products || trendingRes?.products || [];

        // Fetch bestselling / high rated
        const bestsellingRes = await api.get("/products", {
          params: { page: 1, limit: 10, sort: "rating" },
        });
        const bestsellingList = bestsellingRes?.data?.products || bestsellingRes?.products || [];

        // Fetch new arrivals
        const newArrivalsRes = await api.get("/products", {
          params: { page: 1, limit: 10, sort: "newest" },
        });
        const newArrivalsList = newArrivalsRes?.data?.products || newArrivalsRes?.products || [];

        // Fetch fashion products (Category ID: 6ab4d3186fedc375437ac882)
        const fashionRes = await api.get("/products", {
          params: { category: "6ab4d3186fedc375437ac882", page: 1, limit: 8 },
        });
        const fashionList = fashionRes?.data?.products || fashionRes?.products || [];

        // Fetch electronics products (Category ID: 6ab4d3186fedc375437ac887)
        const electronicsRes = await api.get("/products", {
          params: { category: "6ab4d3186fedc375437ac887", page: 1, limit: 8 },
        });
        const electronicsList = electronicsRes?.data?.products || electronicsRes?.products || [];

        if (!cancelled) {
          setTrendingProducts(trendingList.map(normalizeProduct).filter(Boolean));
          setBestsellingProducts(bestsellingList.map(normalizeProduct).filter(Boolean));
          setNewArrivals(newArrivalsList.map(normalizeProduct).filter(Boolean));
          setFashionProducts(fashionList.map(normalizeProduct).filter(Boolean));
          setElectronicsProducts(electronicsList.map(normalizeProduct).filter(Boolean));
        }
      } catch (err) {
        console.error("Failed to fetch product shelves:", err);
      } finally {
        if (!cancelled) {
          setIsLoadingShelves(false);
        }
      }
    };

    fetchShelves();

    // Check recently viewed items from localStorage
    try {
      const stored = localStorage.getItem("dwellmart-recently-viewed");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentlyViewed(parsed.slice(0, 10).map(normalizeProduct).filter(Boolean));
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    return () => {
      cancelled = true;
    };
  }, [normalizeProduct]);

  // Root categories
  const rootCategories = useMemo(() => {
    return getRootCategories().filter((cat) => cat.isActive !== false);
  }, [getRootCategories]);

  return (
    <PageTransition>
      <MobileLayout>
        <div className="w-full pb-12">
          {/* Dual Storefront Switcher (Retail Store B2C vs Wholesale Hub B2B) */}
          <ExperienceSwitcher className="mt-2.5 sm:mt-3 mb-1" />



          {/* Horizontal Quick-Category Ribbon */}
          <RetailQuickCategoryRibbon categories={rootCategories} />

          {/* Hero Banner Carousel */}
          <div className="max-w-[1920px] mx-auto px-3 sm:px-6">
            <RetailHeroBanner banners={banners} />
          </div>

          {/* Shelf 1: Trending Retail Deals */}
          <RetailProductShelf
            title="Trending Retail Deals"
            subtitle="Top-selling picks with exclusive consumer discounts"
            badge="Top Value"
            badgeColor="bg-red-500/15 text-red-600 border-red-500/30"
            products={trendingProducts}
            isLoading={isLoadingShelves}
            seeAllLink="/shop?sort=discount"
          />

          {/* Shelf 2: Bestselling Consumer Favorites */}
          <RetailProductShelf
            title="Bestselling Consumer Favorites"
            subtitle="Highest rated products loved by shoppers across India"
            badge="Customer Choice"
            badgeColor="bg-amber-400/15 text-amber-600 border-amber-400/30"
            products={bestsellingProducts}
            isLoading={isLoadingShelves}
            seeAllLink="/shop?sort=rating"
          />

          {/* Department Spotlight: Fashion & Lifestyle */}
          {fashionProducts.length > 0 && (
            <div className="max-w-[1920px] mx-auto px-3 sm:px-6 my-6">
              <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent p-5 sm:p-7 border border-amber-400/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      Department Spotlight
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black text-textColor-primary mt-1">
                      Fashion & Designer Lifestyle
                    </h3>
                    <p className="text-xs sm:text-sm text-textColor-muted">
                      Men's, Women's & Kids' wear, footwear and luxury accessories
                    </p>
                  </div>
                  <Link
                    to="/category/6ab4d3186fedc375437ac882"
                    className="text-xs sm:text-sm font-black text-amber-500 hover:text-amber-600 flex items-center gap-1"
                  >
                    View All Fashion →
                  </Link>
                </div>
                <div className="flex gap-3.5 overflow-x-auto scrollbar-hide py-1 snap-x snap-mandatory">
                  {fashionProducts.map((p) => (
                    <div key={p.id} className="w-[calc(50%-7px)] sm:w-52 md:w-60 shrink-0 snap-start">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Department Spotlight: Electronics & Mobiles */}
          {electronicsProducts.length > 0 && (
            <div className="max-w-[1920px] mx-auto px-3 sm:px-6 my-6">
              <div className="rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent p-5 sm:p-7 border border-blue-400/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-400/20 px-2.5 py-0.5 rounded-full border border-blue-400/30">
                      Tech Spotlight
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black text-textColor-primary mt-1">
                      Electronics & Smart Mobiles
                    </h3>
                    <p className="text-xs sm:text-sm text-textColor-muted">
                      Smartphones, audio gear, laptop peripherals, and tech gadgets
                    </p>
                  </div>
                  <Link
                    to="/category/6ab4d3186fedc375437ac887"
                    className="text-xs sm:text-sm font-black text-blue-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    View All Electronics →
                  </Link>
                </div>
                <div className="flex gap-3.5 overflow-x-auto scrollbar-hide py-1 snap-x snap-mandatory">
                  {electronicsProducts.map((p) => (
                    <div key={p.id} className="w-[calc(50%-7px)] sm:w-52 md:w-60 shrink-0 snap-start">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Shelf 3: New Arrivals */}
          <RetailProductShelf
            title="Fresh New Arrivals"
            subtitle="Newly cataloged merchandise ready for immediate dispatch"
            badge="Just Landed"
            badgeColor="bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
            products={newArrivals}
            isLoading={isLoadingShelves}
            seeAllLink="/shop?sort=newest"
          />

          {/* Recently Viewed Products Shelf */}
          {recentlyViewed.length > 0 && (
            <RetailProductShelf
              title="Recently Viewed Products"
              subtitle="Continue shopping where you left off"
              badge="Your History"
              badgeColor="bg-slate-500/15 text-slate-700 border-slate-500/30"
              products={recentlyViewed}
              seeAllLink={null}
            />
          )}

          {/* Bottom Trust & Safe Shopping Guarantee */}
          <div className="max-w-[1920px] mx-auto px-3 sm:px-6 my-8">
            <div className="rounded-3xl bg-surface-card border border-border/70 p-6 sm:p-10 shadow-xs">
              <div className="max-w-2xl mb-6">
                <span className="text-xs font-black text-amber-500 uppercase tracking-widest">
                  Why Shop on Dwell Mart Retail
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-textColor-primary tracking-tight mt-1">
                  Built for Seamless Consumer Shopping
                </h3>
                <p className="text-xs sm:text-sm text-textColor-secondary mt-1">
                  Enjoy authentic retail shopping with direct vendor guarantees, DTDC courier tracking, and responsive Indian customer care.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-surface-background border border-border/60">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-500 flex items-center justify-center mb-3">
                    <FiTruck className="text-xl" />
                  </div>
                  <h4 className="text-sm font-bold text-textColor-primary">Pan-India Courier</h4>
                  <p className="text-xs text-textColor-muted mt-1">
                    Doorstep delivery via DTDC express across 27,000+ pin codes.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-background border border-border/60">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                    <FiShield className="text-xl" />
                  </div>
                  <h4 className="text-sm font-bold text-textColor-primary">Genuine Guarantee</h4>
                  <p className="text-xs text-textColor-muted mt-1">
                    Every product is sourced from verified business merchants.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-background border border-border/60">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
                    <FiCheckCircle className="text-xl" />
                  </div>
                  <h4 className="text-sm font-bold text-textColor-primary">7-Day Easy Return</h4>
                  <p className="text-xs text-textColor-muted mt-1">
                    Hassle-free reverse pickups and immediate refunds.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-background border border-border/60">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
                    <FiStar className="text-xl" />
                  </div>
                  <h4 className="text-sm font-bold text-textColor-primary">Verified Reviews</h4>
                  <p className="text-xs text-textColor-muted mt-1">
                    Real ratings and feedback from verified purchasers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default RetailHome;
