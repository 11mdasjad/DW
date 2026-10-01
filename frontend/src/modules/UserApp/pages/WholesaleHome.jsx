import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiBox,
  FiChevronRight,
  FiTruck,
  FiCheckCircle,
  FiFileText,
  FiPercent,
  FiShield,
  FiLayers,
  FiArrowRight,
  FiPackage,
  FiStar
} from "react-icons/fi";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import { useExperienceStore } from "../../../shared/store/experienceStore";
import { useCategoryStore } from "../../../shared/store/categoryStore";
import WholesaleHeroBanner from "../components/Wholesale/WholesaleHeroBanner";
import WholesaleQuickCategoryRibbon from "../components/Wholesale/WholesaleQuickCategoryRibbon";
import ExperienceSwitcher from "../components/QuickCommerce/ExperienceSwitcher";
import ProductCard from "../../../shared/components/ProductCard";
import CategoryImage from "../../../shared/components/CategoryImage";
import api from "../../../shared/utils/api";
import { EXPERIENCES } from "../../../shared/utils/experience";

/**
 * Wholesale Product Shelf component matching RetailProductShelf aesthetic
 */
const WholesaleProductShelf = ({
  title,
  subtitle,
  badge,
  badgeColor,
  products = [],
  isLoading = false,
  seeAllLink = "/search?experience=wholesale"
}) => {
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="w-full max-w-[1920px] mx-auto px-3 sm:px-6 my-6 sm:my-8">
      {/* Shelf Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          {badge && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1 ${
                badgeColor || "bg-amber-400/15 text-amber-600 border border-amber-400/30"
              }`}
            >
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
 * WholesaleHome (B2B Wholesale Storefront)
 *
 * Fully dedicated Wholesale Storefront matching RetailHome's design structure:
 * - Experience Switcher (Retail Store vs Wholesale Hub)
 * - Quick Wholesale Category Ribbon (Horizontal 1-tap browse)
 * - Cinematic B2B Hero Carousel with 4-pillar trust standards
 * - Tiered Product Shelves (Trending, Bestselling Bulk, Industrial, New Arrivals)
 * - Department Spotlights (Industrial & B2B, Manufacturers Hub)
 * - All Wholesale Departments Showcase Grid
 * - B2B Commercial Procurement Guarantee
 */
const WholesaleHome = () => {
  const navigate = useNavigate();
  const { setExperience } = useExperienceStore();
  const { categories, initialize, isLoading: isCatsLoading } = useCategoryStore();

  const [banners, setBanners] = useState([]);
  const [trendingWholesale, setTrendingWholesale] = useState([]);
  const [bestsellingWholesale, setBestsellingWholesale] = useState([]);
  const [newArrivalsWholesale, setNewArrivalsWholesale] = useState([]);
  const [industrialProducts, setIndustrialProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoadingShelves, setIsLoadingShelves] = useState(true);

  // Set active experience to wholesale on mount
  useEffect(() => {
    setExperience(EXPERIENCES.WHOLESALE);
    initialize("wholesale");
  }, [setExperience, initialize]);

  // Load banners for wholesale
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/banners", { params: { type: "wholesale" } });
        const list = res?.data || res || [];
        if (Array.isArray(list)) {
          setBanners(list.filter((b) => b.isActive !== false && (b.type === "wholesale" || b.experience === "wholesale")));
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
      wholesaleEnabled: true,
    };
  }, []);

  // Fetch Wholesale Shelves
  useEffect(() => {
    let cancelled = false;

    const fetchShelves = async () => {
      setIsLoadingShelves(true);
      try {
        // Trending wholesale
        const trendingRes = await api.get("/products", {
          params: { experience: "wholesale", page: 1, limit: 10, sort: "rating" },
        });
        const trendingList = trendingRes?.data?.products || trendingRes?.products || [];

        // Bestselling bulk lots
        const bestsellingRes = await api.get("/products", {
          params: { experience: "wholesale", page: 1, limit: 10, sort: "popular" },
        });
        const bestsellingList = bestsellingRes?.data?.products || bestsellingRes?.products || [];

        // Factory direct new arrivals
        const newArrivalsRes = await api.get("/products", {
          params: { experience: "wholesale", page: 1, limit: 10, sort: "newest" },
        });
        const newArrivalsList = newArrivalsRes?.data?.products || newArrivalsRes?.products || [];

        // Industrial & machinery products
        const industrialRes = await api.get("/products", {
          params: { experience: "wholesale", page: 1, limit: 8, sort: "newest", isFeatured: "true" },
        });
        const industrialList = industrialRes?.data?.products || industrialRes?.products || [];

        if (!cancelled) {
          setTrendingWholesale(trendingList.map(normalizeProduct).filter(Boolean));
          setBestsellingWholesale(bestsellingList.map(normalizeProduct).filter(Boolean));
          setNewArrivalsWholesale(newArrivalsList.map(normalizeProduct).filter(Boolean));
          setIndustrialProducts(industrialList.map(normalizeProduct).filter(Boolean));
        }
      } catch (err) {
        console.error("Failed to fetch wholesale product shelves:", err);
      } finally {
        if (!cancelled) {
          setIsLoadingShelves(false);
        }
      }
    };

    fetchShelves();

    // Check recently viewed wholesale items from localStorage
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

  // Root wholesale categories strictly filtered
  const rootCategories = useMemo(() => {
    return categories
      .filter((c) => (!c.parentId && !c.parent) && c.isActive !== false)
      .filter((cat) => {
        const exps = Array.isArray(cat.supportedExperiences)
          ? cat.supportedExperiences
          : [cat.experience || EXPERIENCES.WHOLESALE];
        return exps.includes(EXPERIENCES.WHOLESALE) || exps.includes("b2b");
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [categories]);

  return (
    <PageTransition>
      <MobileLayout showBottomNav showCartBar>
        <div className="w-full pb-16 min-h-screen bg-surface-background text-textColor-primary">
          {/* Dual Storefront Switcher (Retail Store B2C vs Wholesale Hub B2B) */}
          <ExperienceSwitcher className="mt-2.5 sm:mt-3 mb-1" />

          {/* Horizontal Quick-Category Ribbon */}
          <WholesaleQuickCategoryRibbon
            categories={rootCategories}
            isLoading={isCatsLoading}
          />

          {/* Hero Banner Carousel with 4-pillar trust standards */}
          <div className="max-w-[1920px] mx-auto px-3 sm:px-6">
            <WholesaleHeroBanner banners={banners} />
          </div>

          {/* Shelf 1: Trending Wholesale Deals */}
          <WholesaleProductShelf
            title="Trending Wholesale Deals"
            subtitle="High-demand bulk inventory with tiered carton discounts"
            badge="Top Volume Sourcing"
            badgeColor="bg-amber-400/15 text-amber-600 border-amber-400/30"
            products={trendingWholesale}
            isLoading={isLoadingShelves}
            seeAllLink="/search?experience=wholesale&sort=rating"
          />

          {/* Shelf 2: Bestselling Factory Lots */}
          <WholesaleProductShelf
            title="Bestselling Factory Lots"
            subtitle="Highest volume orders placed by verified retail businesses across India"
            badge="Verified Mill Sourcing"
            badgeColor="bg-blue-500/15 text-blue-600 border-blue-500/30"
            products={bestsellingWholesale}
            isLoading={isLoadingShelves}
            seeAllLink="/search?experience=wholesale&sort=popular"
          />

          {/* Department Spotlight: Industrial Hardware & Equipment */}
          {industrialProducts.length > 0 && (
            <div className="max-w-[1920px] mx-auto px-3 sm:px-6 my-6">
              <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent p-5 sm:p-7 border border-amber-400/30">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      B2B Sourcing Spotlight
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black text-textColor-primary mt-1">
                      Industrial Equipment, Machinery & Hardware
                    </h3>
                    <p className="text-xs sm:text-sm text-textColor-muted">
                      Direct factory rates on precision tools, safety wear & workshop machinery
                    </p>
                  </div>
                  <Link
                    to="/wholesale/categories"
                    className="text-xs sm:text-sm font-black text-amber-500 hover:text-amber-600 flex items-center gap-1"
                  >
                    <span>View All Wholesale Departments</span>
                    <FiChevronRight className="text-sm" />
                  </Link>
                </div>
                <div className="flex gap-3.5 overflow-x-auto scrollbar-hide py-1 snap-x snap-mandatory">
                  {industrialProducts.map((p) => (
                    <div key={p.id} className="w-[calc(50%-7px)] sm:w-52 md:w-60 shrink-0 snap-start">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Shelf 3: Direct Mill New Arrivals */}
          <WholesaleProductShelf
            title="Direct Mill New Arrivals"
            subtitle="Freshly cataloged inventory straight from manufacturing floors"
            badge="Fresh Production Runs"
            badgeColor="bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
            products={newArrivalsWholesale}
            isLoading={isLoadingShelves}
            seeAllLink="/search?experience=wholesale&sort=newest"
          />

          {/* Shelf 4: Recently Viewed Wholesale Items */}
          {recentlyViewed.length > 0 && (
            <WholesaleProductShelf
              title="Recently Viewed Wholesale Items"
              subtitle="Quickly review and reorder bulk products you inspected"
              badge="Your Sourcing History"
              badgeColor="bg-slate-500/15 text-slate-700 border-slate-500/30"
              products={recentlyViewed}
              seeAllLink="/search?experience=wholesale"
            />
          )}

          {/* Wholesale Departments Grid Showcase */}
          {rootCategories.length > 0 && (
            <section className="max-w-[1920px] mx-auto px-3 sm:px-6 my-8">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30 mb-1 inline-block">
                    Full Sourcing Catalog
                  </span>
                  <h3 className="text-lg sm:text-2xl font-black text-textColor-primary tracking-tight">
                    Explore Wholesale Departments
                  </h3>
                  <p className="text-xs sm:text-sm text-textColor-muted mt-0.5">
                    Select a core B2B department to source carton and pallet lots directly
                  </p>
                </div>
                <Link
                  to="/wholesale/categories"
                  className="shrink-0 text-xs sm:text-sm font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1 transition-colors group"
                >
                  <span>All Categories</span>
                  <FiChevronRight className="text-sm transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {rootCategories.map((cat) => {
                  const catId = cat._id || cat.id;
                  return (
                    <Link
                      key={catId}
                      to={`/category/${catId}?experience=wholesale`}
                      className="group p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-surface-card border border-border/70 hover:border-amber-400 shadow-2xs hover:shadow-lg transition-all flex flex-col items-center text-center cursor-pointer"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-900 border border-amber-400/30 group-hover:border-amber-400 p-1 mb-3 group-hover:scale-105 transition-transform flex items-center justify-center">
                        <CategoryImage
                          src={cat.image || cat.icon}
                          alt={cat.name}
                          name={cat.name}
                          className="w-full h-full object-contain rounded-xl"
                          containerClassName="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
                        />
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-textColor-primary group-hover:text-amber-500 transition-colors line-clamp-1">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-textColor-muted line-clamp-1 mt-0.5">
                        {cat.description || "Direct factory sourcing & volume tiers"}
                      </p>
                      <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-400/10 text-amber-600 border border-amber-400/20 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                        <span>Source Bulk Lots</span>
                        <FiArrowRight className="text-[10px]" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* B2B Commercial Procurement Guarantee */}
          <div className="max-w-[1920px] mx-auto px-3 sm:px-6 my-8">
            <div className="rounded-3xl bg-surface-card border border-border/70 p-6 sm:p-10 shadow-xs">
              <div className="max-w-2xl mb-6">
                <span className="text-xs font-black text-amber-500 uppercase tracking-widest">
                  Dwell Mart B2B Business Standards
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-textColor-primary tracking-tight mt-1">
                  Direct Factory Procurement Guaranteed
                </h3>
                <p className="text-xs sm:text-sm text-textColor-secondary mt-1">
                  Order carton and pallet lots directly from verified Indian mills and authorized distributors with full commercial safety.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-surface-background border border-border/60">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-500 flex items-center justify-center mb-3">
                    <FiBox className="text-xl" />
                  </div>
                  <h4 className="text-sm font-bold text-textColor-primary">Direct Factory Rates</h4>
                  <p className="text-xs text-textColor-muted mt-1">
                    Direct access to manufacturer inventory without intermediary distributor markups.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-background border border-border/60">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
                    <FiPercent className="text-xl" />
                  </div>
                  <h4 className="text-sm font-bold text-textColor-primary">Tiered Volume Slabs</h4>
                  <p className="text-xs text-textColor-muted mt-1">
                    Automatic quantity slab discounts unlock as your carton counts increase.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-background border border-border/60">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                    <FiFileText className="text-xl" />
                  </div>
                  <h4 className="text-sm font-bold text-textColor-primary">100% GST Tax Invoices</h4>
                  <p className="text-xs text-textColor-muted mt-1">
                    GST-compliant tax invoices with HSN/SAC codes for complete Input Tax Credit (ITC).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-background border border-border/60">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
                    <FiTruck className="text-xl" />
                  </div>
                  <h4 className="text-sm font-bold text-textColor-primary">Doorstep Bulk Freight</h4>
                  <p className="text-xs text-textColor-muted mt-1">
                    Pallet and surface cargo transport tracked to your commercial warehouse across India.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Directory CTA Banner */}
          <div className="max-w-[1920px] mx-auto px-3 sm:px-6 my-6 text-center">
            <Link
              to="/wholesale/categories"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-black font-black text-sm shadow-md hover:shadow-lg transition-all"
            >
              <FiLayers className="text-base" />
              <span>Explore All Wholesale Categories Directory</span>
              <FiChevronRight className="text-base" />
            </Link>
          </div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default WholesaleHome;
