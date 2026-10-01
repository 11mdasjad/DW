import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiAward,
  FiBox,
  FiPercent,
  FiStar,
  FiTruck
} from "react-icons/fi";

const INDUSTRY_FLOORS = [
  {
    id: "apparel-floor",
    floorNumber: "01F",
    title: "Apparel, Textiles & Fabrics Floor",
    categorySlug: "clothing",
    accentColor: "from-amber-500/20 to-orange-500/5",
    borderTop: "border-amber-500",
    badge: "Mill Direct Sourcing",
    tagline: "Direct spinning mills, knitting units & garment export houses",
    stats: "1,240+ Verified Mills",
    featuredSubcategories: [
      { name: "Cotton T-Shirts & Polos", moq: "MOQ: 20 pcs", price: "From ₹149" },
      { name: "Denim & Casual Jeans", moq: "MOQ: 15 pcs", price: "From ₹399" },
      { name: "Athletic Tracksuits", moq: "MOQ: 10 sets", price: "From ₹449" },
      { name: "Winter Scarves & Caps", moq: "MOQ: 25 pcs", price: "From ₹99" },
    ],
    supplierHighlight: {
      name: "Surat & Tirupur Export Mills Consortium",
      experience: "8 Yrs Gold Supplier",
      responseRate: "99.1% Response",
      rating: "4.9 / 5.0",
    },
  },
  {
    id: "electronics-floor",
    floorNumber: "02F",
    title: "Consumer Electronics & Gadgets Floor",
    categorySlug: "electronics",
    accentColor: "from-blue-500/20 to-indigo-500/5",
    borderTop: "border-blue-500",
    badge: "OEM / ODM Tech",
    tagline: "Certified factories with BIS approval & custom branding",
    stats: "860+ Verified Factories",
    featuredSubcategories: [
      { name: "TWS Earbuds & Headsets", moq: "MOQ: 10 pcs", price: "From ₹299" },
      { name: "Smart Fitness Bands", moq: "MOQ: 10 pcs", price: "From ₹499" },
      { name: "Fast Type-C GaN Chargers", moq: "MOQ: 20 pcs", price: "From ₹180" },
      { name: "Braided Nylon Cables", moq: "MOQ: 50 pcs", price: "From ₹45" },
    ],
    supplierHighlight: {
      name: "Noida Electronics Manufacturing Park",
      experience: "6 Yrs Gold Supplier",
      responseRate: "98.4% Response",
      rating: "4.8 / 5.0",
    },
  },
  {
    id: "home-living-floor",
    floorNumber: "03F",
    title: "Home, Kitchenware & Storage Floor",
    categorySlug: "home",
    accentColor: "from-emerald-500/20 to-teal-500/5",
    borderTop: "border-emerald-500",
    badge: "High Turnover Lots",
    tagline: "Heavy gauge stainless steel, airtight storage & kitchenware",
    stats: "920+ Verified Makers",
    featuredSubcategories: [
      { name: "Triply Stainless Cookware", moq: "MOQ: 5 sets", price: "From ₹899" },
      { name: "Airtight Food Containers", moq: "MOQ: 20 sets", price: "From ₹129" },
      { name: "Microfiber Bedding Sets", moq: "MOQ: 10 sets", price: "From ₹349" },
      { name: "Silicone Kitchen Utensils", moq: "MOQ: 30 sets", price: "From ₹85" },
    ],
    supplierHighlight: {
      name: "Rajkot & Morvi Industrial Cluster",
      experience: "10 Yrs Gold Supplier",
      responseRate: "99.4% Response",
      rating: "4.9 / 5.0",
    },
  },
];

/**
 * AlibabaIndustryFloors
 *
 * Alibaba.com-style Multi-floor Trade Pavilions:
 * - Specific industry floors with floor numbers (01F, 02F, 03F)
 * - Verified manufacturer badges, response rates, and MOQ indicators
 * - Direct deep links into wholesale category search
 */
const AlibabaIndustryFloors = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 my-8 sm:my-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-500">
              Industry Procurement Floors
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-textColor-primary tracking-tight">
            Source by Specialized Industry Floor
          </h2>
          <p className="text-xs sm:text-sm text-textColor-muted mt-0.5">
            Connect directly with verified manufacturing clusters and industrial hubs across India.
          </p>
        </div>

        <Link
          to="/wholesale/categories"
          className="text-xs font-bold text-amber-500 hover:text-amber-600 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>All 24 Industry Floors</span>
          <FiArrowRight className="text-xs" />
        </Link>
      </div>

      {/* Floors List */}
      <div className="space-y-6">
        {INDUSTRY_FLOORS.map((floor) => (
          <div
            key={floor.id}
            className={`rounded-3xl bg-surface-card border border-borderToken-default shadow-xs overflow-hidden border-t-4 ${floor.borderTop}`}
          >
            {/* Floor Header Bar */}
            <div className={`p-4 sm:p-6 bg-gradient-to-r ${floor.accentColor} border-b border-borderToken-default/60 flex flex-col md:flex-row md:items-center justify-between gap-3`}>
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono tracking-tight bg-surface-card px-2.5 py-1 rounded-xl border border-borderToken-default shadow-xs">
                  {floor.floorNumber}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-textColor-primary">
                      {floor.title}
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-700 hidden sm:inline-block">
                      {floor.badge}
                    </span>
                  </div>
                  <p className="text-xs text-textColor-muted mt-0.5">
                    {floor.tagline} • <span className="font-semibold text-textColor-primary">{floor.stats}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/category/${floor.categorySlug}?experience=wholesale`)}
                className="self-start md:self-center px-4 py-2 rounded-xl bg-surface-card hover:bg-surface-background border border-borderToken-default text-xs font-black text-textColor-primary hover:text-amber-500 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Enter Floor Catalog</span>
                <FiArrowRight className="text-xs text-amber-500" />
              </button>
            </div>

            {/* Floor Body: Sourcing Subcategories + Verified Cluster Spotlight */}
            <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">

              {/* Subcategories Grid - 8 cols */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {floor.featuredSubcategories.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(item.name)}&experience=wholesale`)}
                    className="p-3.5 rounded-2xl bg-surface-background border border-borderToken-default hover:border-amber-500/50 hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-600 block w-fit mb-1.5">
                      {item.moq}
                    </span>
                    <h4 className="text-xs font-black text-textColor-primary group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-xs font-black text-emerald-600 mt-2">
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Verified Cluster Spotlight - 4 cols */}
              <div className="lg:col-span-4 p-4 rounded-2xl bg-surface-background border border-borderToken-default">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-500 uppercase tracking-wider mb-1">
                  <FiAward className="text-sm" />
                  <span>Audited Supply Cluster</span>
                </div>
                <h5 className="text-xs sm:text-sm font-black text-textColor-primary leading-tight">
                  {floor.supplierHighlight.name}
                </h5>
                <div className="mt-2.5 space-y-1.5 text-xs text-textColor-secondary">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-textColor-muted">Supplier Status:</span>
                    <span className="font-bold text-amber-500">{floor.supplierHighlight.experience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-textColor-muted">Inquiry Speed:</span>
                    <span className="font-bold text-emerald-600">{floor.supplierHighlight.responseRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-textColor-muted">Buyer Feedback:</span>
                    <span className="font-bold text-textColor-primary flex items-center gap-1">
                      <FiStar className="text-amber-400 fill-amber-400 text-xs" /> {floor.supplierHighlight.rating}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/category/${floor.categorySlug}?experience=wholesale`)}
                  className="mt-3 w-full py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 text-xs font-black transition-colors text-center cursor-pointer"
                >
                  Contact Verified Mills
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AlibabaIndustryFloors;
