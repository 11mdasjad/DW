import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiZap,
  FiBox,
  FiAward,
  FiArrowRight,
  FiShield,
  FiCheckCircle,
  FiTrendingUp,
  FiTruck,
  FiClock,
  FiLayers
} from "react-icons/fi";

const PAVILIONS = [
  {
    id: "ready-to-ship",
    title: "Ready to Ship",
    badge: "⚡ Fast Dispatch",
    badgeColor: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30",
    description: "Low MOQ starting from 1 carton. In-stock lots ready for dispatch within 48 hours.",
    features: ["Low MOQ ≤ 20 Units", "Dispatch in 48h", "Instant Transparent Checkout"],
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    borderHover: "hover:border-emerald-500/50",
    cta: "Source Ready Lots",
    filterParam: "sort=newest",
    icon: "📦",
    tagCount: "2,400+ Active Lots",
  },
  {
    id: "custom-oem",
    title: "Custom Manufacturers",
    badge: "🏭 OEM / ODM",
    badgeColor: "bg-blue-500/15 text-blue-600 border border-blue-500/30",
    description: "Verified mills capable of customized branding, packaging, and custom size specifications.",
    features: ["Custom Logo & Labeling", "Lab Inspection Certified", "Sample Orders Supported"],
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    borderHover: "hover:border-blue-500/50",
    cta: "Find Manufacturers",
    filterParam: "sort=rating",
    icon: "🛠️",
    tagCount: "1,150+ Verified Mills",
  },
  {
    id: "top-ranking",
    title: "Top-Ranking Bulk Lots",
    badge: "🔥 High Margin",
    badgeColor: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
    description: "Highest repeat orders and maximum retail profit margin for shopkeepers and online sellers.",
    features: ["Deep Volume Slabs", "High Repeat Demand", "Full GST ITC Invoices"],
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    borderHover: "hover:border-amber-500/50",
    cta: "View Top Lots",
    filterParam: "sort=popular",
    icon: "📈",
    tagCount: "890+ Trending Slabs",
  },
  {
    id: "factory-direct",
    title: "Direct Mill Showroom",
    badge: "⭐ 0% Middlemen",
    badgeColor: "bg-purple-500/15 text-purple-600 border border-purple-500/30",
    description: "Connect directly with primary factories. Real factory rates without distributor markup.",
    features: ["Direct Mill Contracts", "Surface & Pallet Freight", "Payment Protection"],
    gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
    borderHover: "hover:border-purple-500/50",
    cta: "Explore Showroom",
    filterParam: "sort=newest",
    icon: "🏛️",
    tagCount: "4,500+ Factory SKUs",
  },
];

/**
 * AlibabaSourcingPavilions
 *
 * Replicates Alibaba.com's 4-Pavilion Sourcing Hub:
 * - Ready to Ship
 * - Custom Manufacturers (OEM/ODM)
 * - Top-Ranking Bulk Lots
 * - Direct Mill Showroom
 */
const AlibabaSourcingPavilions = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 my-6 sm:my-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-500">
              Alibaba-Grade B2B Sourcing Pavilions
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-textColor-primary tracking-tight">
            Procure by Trade Channel
          </h2>
          <p className="text-xs sm:text-sm text-textColor-muted mt-0.5">
            Select your preferred wholesale procurement model for maximum margins and reliable lead times.
          </p>
        </div>

        <Link
          to="/wholesale/categories"
          className="text-xs font-bold text-amber-500 hover:text-amber-600 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>All Sourcing Categories</span>
          <FiArrowRight className="text-xs" />
        </Link>
      </div>

      {/* 4-Pavilion Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {PAVILIONS.map((pavilion) => (
          <motion.div
            key={pavilion.id}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(`/search?experience=wholesale&${pavilion.filterParam}`)}
            className={`cursor-pointer rounded-2xl bg-surface-card border border-borderToken-default p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md ${pavilion.borderHover} relative overflow-hidden`}
          >
            {/* Ambient Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${pavilion.gradient} pointer-events-none`}
            />

            <div className="relative z-10">
              {/* Header: Icon + Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{pavilion.icon}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${pavilion.badgeColor}`}>
                  {pavilion.badge}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-black text-textColor-primary mb-1">
                {pavilion.title}
              </h3>
              <p className="text-xs text-textColor-muted line-clamp-2 leading-relaxed mb-3">
                {pavilion.description}
              </p>

              {/* Features List */}
              <div className="space-y-1.5 pt-2 border-t border-borderToken-default/60">
                {pavilion.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-textColor-secondary">
                    <FiCheckCircle className="text-emerald-500 text-xs shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer & CTA */}
            <div className="relative z-10 mt-4 pt-3 border-t border-borderToken-default/60 flex items-center justify-between">
              <span className="text-[10px] font-bold text-textColor-muted">
                {pavilion.tagCount}
              </span>
              <span className="text-xs font-black text-amber-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                {pavilion.cta} <FiArrowRight className="text-xs" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AlibabaSourcingPavilions;
