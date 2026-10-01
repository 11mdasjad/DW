import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBox,
  FiBriefcase,
  FiFileText,
  FiTruck,
  FiCheckCircle,
  FiArrowRight,
  FiLayers,
  FiShield,
  FiTrendingDown,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { formatPrice } from "../../../../shared/utils/helpers";

const WHOLESALE_CATEGORIES = [
  { name: "Textiles & Garments", icon: "🧵", link: "/wholesale?category=textiles" },
  { name: "FMCG & Groceries Bulk", icon: "📦", link: "/wholesale?category=fmcg" },
  { name: "Packaging & Boxes", icon: "📐", link: "/wholesale?category=packaging" },
  { name: "Hardware & Tools", icon: "🔧", link: "/wholesale?category=tools" },
  { name: "Beauty & Personal Care Bulk", icon: "🧴", link: "/wholesale?category=beauty" },
  { name: "Kitchen & Cookware", icon: "🍳", link: "/wholesale?category=kitchen" },
];

const SAMPLE_WHOLESALE_PRODUCTS = [
  {
    id: "ws-1",
    name: "Pure Cotton Premium Men's Casual Shirts (Assorted)",
    supplier: "Vardhman Textiles Ltd.",
    supplierRating: 4.8,
    moq: 20,
    unit: "pcs",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    retailPrice: 899,
    tiers: [
      { minQty: 20, price: 349 },
      { minQty: 50, price: 299 },
      { minQty: 100, price: 249 },
    ],
  },
  {
    id: "ws-2",
    name: "Organic Whole Wheat Atta 10kg Master Carton (Pack of 5)",
    supplier: "Kisan Agro Foods Co.",
    supplierRating: 4.9,
    moq: 10,
    unit: "cartons",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    retailPrice: 2200,
    tiers: [
      { minQty: 10, price: 1750 },
      { minQty: 30, price: 1620 },
      { minQty: 60, price: 1490 },
    ],
  },
  {
    id: "ws-3",
    name: "Wireless Earbuds with ENC Microphone Bulk Packaging",
    supplier: "TechZone Micro Electronics",
    supplierRating: 4.7,
    moq: 15,
    unit: "sets",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    retailPrice: 1499,
    tiers: [
      { minQty: 15, price: 599 },
      { minQty: 50, price: 499 },
      { minQty: 150, price: 399 },
    ],
  },
  {
    id: "ws-4",
    name: "Non-Stick 3-Piece Cookware Set with Glass Lids",
    supplier: "Prestige Metal Crafts",
    supplierRating: 4.8,
    moq: 12,
    unit: "sets",
    image:
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80",
    retailPrice: 2499,
    tiers: [
      { minQty: 12, price: 1199 },
      { minQty: 36, price: 999 },
      { minQty: 72, price: 849 },
    ],
  },
];

const HomeWholesaleB2BSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-10 sm:py-14 bg-white border-y border-gray-200">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6">
        {/* B2B Header & Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0d1d33] via-[#17365D] to-[#122845] p-6 sm:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
            <FiBox className="text-[260px]" />
          </div>

          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-black uppercase tracking-wider">
              <FiBriefcase className="text-xs" />
              <span>Dwell Mart B2B Wholesale Hub</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Direct Manufacturer Sourcing for Retailers &amp; Businesses
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Source products in bulk with verified suppliers, transparent minimum order quantities (MOQs), tiered quantity discounts, and GST invoice protection.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/wholesale"
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <FiBox className="text-sm" />
                <span>Explore All Wholesale Catalog</span>
                <FiArrowRight />
              </Link>

              <Link
                to="/wholesale"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <FiFileText className="text-sm text-blue-300" />
                <span>Submit RFQ (Request for Quote)</span>
              </Link>
            </div>
          </div>

          {/* Quick Wholesale Categories Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {WHOLESALE_CATEGORIES.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-colors text-xs text-gray-200 hover:text-white"
              >
                <span className="text-base">{cat.icon}</span>
                <span className="truncate font-semibold">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Wholesale Product Cards with Tiered Pricing */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-gray-900">
              Popular Bulk Deals &amp; Quantity Discounts
            </h3>
            <p className="text-xs text-gray-500">
              Real wholesale prices verified with manufacturers and licensed distributors
            </p>
          </div>

          <Link
            to="/wholesale"
            className="text-xs sm:text-sm font-bold text-[#17365D] hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            <span>View All B2B Deals</span>
            <FiArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_WHOLESALE_PRODUCTS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-blue-400 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Product Image & MOQ Pill */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 bg-[#17365D] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow">
                    MOQ: {item.moq} {item.unit}
                  </div>
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                    Save up to {Math.round(((item.retailPrice - item.tiers[item.tiers.length - 1].price) / item.retailPrice) * 100)}%
                  </div>
                </div>

                {/* Title & Supplier */}
                <h4 className="font-bold text-sm text-gray-900 line-clamp-2 hover:text-[#17365D] cursor-pointer transition-colors">
                  {item.name}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
                  <span className="font-semibold text-gray-700">{item.supplier}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                    ★ {item.supplierRating}
                  </span>
                </div>

                {/* Tiered Pricing Table */}
                <div className="mt-3 bg-gray-50 rounded-xl p-2.5 border border-gray-200/80">
                  <div className="text-[10px] font-black uppercase text-gray-500 mb-1 flex items-center justify-between">
                    <span>Quantity Tier</span>
                    <span>Price / {item.unit}</span>
                  </div>
                  <div className="space-y-1">
                    {item.tiers.map((tier, tIdx) => (
                      <div
                        key={tIdx}
                        className={`flex items-center justify-between text-xs px-1.5 py-0.5 rounded ${
                          tIdx === item.tiers.length - 1
                            ? "bg-emerald-50 text-emerald-800 font-extrabold"
                            : "text-gray-700 font-medium"
                        }`}
                      >
                        <span>{tier.minQty}+ {item.unit}</span>
                        <span>{formatPrice(tier.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/wholesale")}
                  className="flex-1 py-2 bg-[#17365D] hover:bg-[#0f2440] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Order Wholesale
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/wholesale")}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  title="Request Custom Quote"
                >
                  RFQ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeWholesaleB2BSection;
