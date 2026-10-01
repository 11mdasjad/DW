import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiBox,
  FiShoppingCart,
  FiHeart,
  FiChevronRight,
  FiTruck,
  FiCheckCircle,
  FiFileText,
  FiPercent,
  FiShield,
  FiClock,
  FiStar
} from "react-icons/fi";
import { motion } from "framer-motion";
import MobileLayout from "../components/Layout/MobileLayout";
import PageTransition from "../../../shared/components/PageTransition";
import { useExperienceStore } from "../../../shared/store/experienceStore";
import { useCartStore, useUIStore } from "../../../shared/store/useStore";
import { useCategoryStore } from "../../../shared/store/categoryStore";
import WholesaleHeroBanner from "../components/Wholesale/WholesaleHeroBanner";
import WholesaleSearchBar from "../components/Wholesale/WholesaleSearchBar";
import WholesaleQuickCategoryRibbon from "../components/Wholesale/WholesaleQuickCategoryRibbon";
import ExperienceSwitcher from "../components/QuickCommerce/ExperienceSwitcher";
import ProductCard from "../../../shared/components/ProductCard";
import { Button } from "../../../shared/components/ui";
import api from "../../../shared/utils/api";
import { EXPERIENCES } from "../../../shared/utils/experience";

/** Fetches Wholesale products with a given sort key */
const fetchWholesaleProducts = async (sort, extra = {}) => {
  try {
    const response = await api.get("/products", {
      params: {
        experience: "wholesale",
        page: 1,
        limit: 10,
        sort,
        ...extra,
      },
    });
    const payload = response?.data ?? response;
    const rawList = Array.isArray(payload?.products) ? payload.products : [];
    return rawList.map((p) => ({
      ...p,
      id: p._id || p.id,
      wholesaleEnabled: true,
    }));
  } catch {
    return [];
  }
};

/** Horizontal product shelf with title and See All link */
const ProductShelf = ({ title, products, isLoading, onSeeAll }) => {
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 mb-6">
      {/* Shelf Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-black text-textColor-primary tracking-tight">
            {title}
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-700 border border-amber-400/30">
            Bulk / MOQ
          </span>
        </div>
        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            See All <FiChevronRight className="text-xs" />
          </button>
        )}
      </div>

      {/* Shelf Product Row */}
      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-[calc(50%-6px)] sm:w-48 h-64 rounded-2xl bg-surface-card animate-pulse border border-borderToken-default shrink-0"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2 snap-x snap-mandatory">
          {products.map((product) => (
            <div
              key={product._id || product.id}
              className="w-[calc(50%-6px)] sm:w-52 md:w-56 shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const WholesaleHome = () => {
  const navigate = useNavigate();
  const { setExperience } = useExperienceStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const toggleCart = useUIStore((state) => state.toggleCart);

  const { categories: storeCategories, initialize: initCategoryStore, isLoading: isCatsLoading } = useCategoryStore();

  // Product shelf states
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [isLoadingBest, setIsLoadingBest] = useState(true);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);

  // Set active experience in experience store to wholesale
  useEffect(() => {
    setExperience(EXPERIENCES.WHOLESALE);
    initCategoryStore("wholesale");
  }, [setExperience, initCategoryStore]);

  // Root categories and subcategories derived from store
  const rootCategories = useMemo(() => {
    return storeCategories
      .filter((c) => (!c.parentId && !c.parent) && c.isActive !== false)
      .filter((cat) => {
        const exps = Array.isArray(cat.supportedExperiences)
          ? cat.supportedExperiences
          : [cat.experience || EXPERIENCES.WHOLESALE];
        return exps.includes(EXPERIENCES.WHOLESALE) || exps.includes("b2b");
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [storeCategories]);

  // Load recently viewed wholesale items from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dwellmart-recently-viewed");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed.slice(0, 8));
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Fetch all product shelves in parallel
  useEffect(() => {
    setIsLoadingFeatured(true);
    setIsLoadingBest(true);
    setIsLoadingTrending(true);
    setIsLoadingRecent(true);

    fetchWholesaleProducts("newest", { isFeatured: "true" })
      .then((p) => {
        if (p.length > 0) {
          setFeatured(p);
        } else {
          return fetchWholesaleProducts("newest").then((all) => setFeatured(all.slice(0, 10)));
        }
      })
      .finally(() => setIsLoadingFeatured(false));

    fetchWholesaleProducts("popular")
      .then((p) => setBestSellers(p))
      .finally(() => setIsLoadingBest(false));

    fetchWholesaleProducts("rating")
      .then((p) => setTrending(p))
      .finally(() => setIsLoadingTrending(false));

    fetchWholesaleProducts("newest")
      .then((p) => setRecentlyAdded(p))
      .finally(() => setIsLoadingRecent(false));
  }, []);



  return (
    <PageTransition>
      <MobileLayout showBottomNav showCartBar>
        <div className="w-full pb-24 lg:pb-12 min-h-screen bg-surface-background text-textColor-primary">

          {/* Dual Storefront Switcher (Retail Store B2C vs Wholesale Hub B2B) */}
          <ExperienceSwitcher className="mt-2.5 sm:mt-3 mb-1" />



          {/* ── Wholesale Hero Banner Slider ── */}
          <WholesaleHeroBanner
            categories={rootCategories}
            onSelectCategory={(slug) => {
              if (slug) {
                navigate(`/category/${slug}?experience=wholesale`);
              } else {
                navigate(`/wholesale/categories`);
              }
            }}
          />

          {/* ── Quick Wholesale Category Ribbon (1-tap browsing) ── */}
          <WholesaleQuickCategoryRibbon
            categories={rootCategories}
            isLoading={isCatsLoading}
          />

          {/* ── Divider ── */}
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 my-4">
            <div className="h-px bg-borderToken-default" />
          </div>

          {/* ── Curated Product Shelves ── */}
          <div className="space-y-6 py-2">
            <ProductShelf
              title="⭐ Featured Wholesale Deals"
              products={featured}
              isLoading={isLoadingFeatured}
              onSeeAll={() => navigate("/search?experience=wholesale&sort=newest")}
            />

            <ProductShelf
              title="🔥 Best Sellers in Bulk"
              products={bestSellers}
              isLoading={isLoadingBest}
              onSeeAll={() => navigate("/search?experience=wholesale&sort=popular")}
            />

            <ProductShelf
              title="📈 Trending B2B Sourcing"
              products={trending}
              isLoading={isLoadingTrending}
              onSeeAll={() => navigate("/search?experience=wholesale&sort=rating")}
            />

            <ProductShelf
              title="🆕 Factory Direct New Arrivals"
              products={recentlyAdded}
              isLoading={isLoadingRecent}
              onSeeAll={() => navigate("/search?experience=wholesale&sort=newest")}
            />

            {/* Recently Viewed Wholesale Items */}
            {recentlyViewed.length > 0 && (
              <ProductShelf
                title="👁️ Recently Viewed Wholesale Items"
                products={recentlyViewed}
                isLoading={false}
                onSeeAll={() => navigate("/search?experience=wholesale")}
              />
            )}
          </div>

          {/* ── B2B Sourcing & Procurement Guarantee Section ── */}
          <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 my-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-borderToken-default shadow-xs">
              <div className="max-w-2xl mb-6">
                <span className="text-xs font-black text-amber-500 uppercase tracking-wider">
                  Dwell Mart B2B Business Standards
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-textColor-primary mt-1">
                  Direct Factory Procurement Guaranteed
                </h3>
                <p className="text-xs sm:text-sm text-textColor-muted mt-1.5">
                  Order carton and pallet lots directly from verified Indian mills and authorized distributors with full commercial safety.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-surface-background border border-borderToken-default">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                    <FiBox className="text-xl" />
                  </div>
                  <h4 className="text-sm font-bold text-textColor-primary">Direct Factory Rates</h4>
                  <p className="text-xs text-textColor-muted mt-1">
                    Direct access to manufacturer inventory without intermediary distributor markups.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-background border border-borderToken-default">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
                    <FiPercent className="text-xl" />
                  </div>
                  <h4 className="text-sm font-bold text-textColor-primary">Tiered Volume Slabs</h4>
                  <p className="text-xs text-textColor-muted mt-1">
                    Automatic quantity slab discounts unlock as your carton counts increase.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-background border border-borderToken-default">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                    <FiFileText className="text-xl" />
                  </div>
                  <h4 className="text-sm font-bold text-textColor-primary">100% GST Tax Invoices</h4>
                  <p className="text-xs text-textColor-muted mt-1">
                    GST-compliant tax invoices with HSN/SAC codes for complete Input Tax Credit (ITC).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-background border border-borderToken-default">
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
          </section>

          {/* ── View All Categories Directory CTA ── */}
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 mt-6 mb-4 text-center">
            <Link
              to="/wholesale/categories"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-black font-black text-sm shadow-md hover:shadow-lg transition-all"
            >
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
