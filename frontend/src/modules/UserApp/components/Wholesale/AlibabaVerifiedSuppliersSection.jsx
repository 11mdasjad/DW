import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiShield,
  FiCheckCircle,
  FiAward,
  FiArrowRight,
  FiStar,
  FiMail,
  FiMapPin,
  FiBox
} from "react-icons/fi";
import toast from "react-hot-toast";

const VERIFIED_SUPPLIERS = [
  {
    id: "sup-1",
    name: "Apex Apparels & Spinning Mills Pvt Ltd",
    location: "Tirupur, Tamil Nadu",
    years: "7 Yrs Gold Supplier",
    auditBadge: "ISO 9001:2015 & BSCI Audited",
    mainProducts: "Cotton T-Shirts, Hoodies, Activewear",
    revenue: "₹45 Cr+ Annual Export",
    floorArea: "18,500 m² Facility",
    responseRate: "99.4%",
    rating: 4.9,
    categorySlug: "clothing",
  },
  {
    id: "sup-2",
    name: "VoltCore Electro-Tech Industries",
    location: "Noida Electronics SEZ, UP",
    years: "5 Yrs Gold Supplier",
    auditBadge: "BIS & CE Certified Production",
    mainProducts: "TWS Earphones, GaN Adapters, Smart Watches",
    revenue: "₹30 Cr+ Annual Volume",
    floorArea: "12,000 m² Cleanroom",
    responseRate: "98.7%",
    rating: 4.8,
    categorySlug: "electronics",
  },
  {
    id: "sup-3",
    name: "Krystal Kitchenware & Homewares Ltd",
    location: "Rajkot, Gujarat",
    years: "9 Yrs Gold Supplier",
    auditBadge: "TÜV Rhineland Facility Verified",
    mainProducts: "Triply Cookware, Storage Sets, Lunchware",
    revenue: "₹60 Cr+ Annual Volume",
    floorArea: "22,000 m² Press Mill",
    responseRate: "99.6%",
    rating: 4.9,
    categorySlug: "home",
  },
];

/**
 * AlibabaVerifiedSuppliersSection
 *
 * Alibaba.com-style Verified Supplier Showcase:
 * - Third-party audit badges (ISO, BSCI, TÜV)
 * - Gold Supplier tenure
 * - Response rate & facility size metrics
 * - Contact supplier action
 */
const AlibabaVerifiedSuppliersSection = ({ onContactSupplier }) => {
  const navigate = useNavigate();

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 my-8 sm:my-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-500">
              Alibaba-Grade Verified Manufacturer Network
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-textColor-primary tracking-tight">
            Connect with Audited Suppliers
          </h2>
          <p className="text-xs sm:text-sm text-textColor-muted mt-0.5">
            Every supplier passes strict background checks, on-site facility inspection, and financial solvency auditing.
          </p>
        </div>

        <Link
          to="/wholesale/categories"
          className="text-xs font-bold text-amber-500 hover:text-amber-600 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>Browse All Manufacturers</span>
          <FiArrowRight className="text-xs" />
        </Link>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {VERIFIED_SUPPLIERS.map((supplier) => (
          <div
            key={supplier.id}
            className="p-5 rounded-3xl bg-surface-card border border-borderToken-default shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Badge & Tenure */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-700 border border-amber-400/30">
                  <FiAward className="text-xs text-amber-500" />
                  {supplier.years}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle className="text-xs" /> Verified
                </span>
              </div>

              {/* Supplier Name */}
              <h3 className="text-sm font-black text-textColor-primary leading-tight line-clamp-1">
                {supplier.name}
              </h3>

              {/* Location */}
              <p className="text-xs text-textColor-muted flex items-center gap-1 mt-1">
                <FiMapPin className="text-xs text-amber-500 shrink-0" />
                <span>{supplier.location}</span>
              </p>

              {/* Audit Badge */}
              <div className="my-3 p-2 rounded-xl bg-surface-background border border-borderToken-default text-[11px] font-semibold text-textColor-secondary flex items-center gap-1.5">
                <FiShield className="text-blue-500 text-xs shrink-0" />
                <span className="truncate">{supplier.auditBadge}</span>
              </div>

              {/* Capabilities & Metrics */}
              <div className="space-y-1.5 text-xs text-textColor-secondary">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-textColor-muted">Main Lines:</span>
                  <span className="font-bold text-textColor-primary truncate max-w-[170px] text-right">
                    {supplier.mainProducts}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-textColor-muted">Facility:</span>
                  <span className="font-semibold text-textColor-secondary">{supplier.floorArea}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-textColor-muted">Response Rate:</span>
                  <span className="font-bold text-emerald-600">{supplier.responseRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-textColor-muted">Buyer Rating:</span>
                  <span className="font-black text-textColor-primary flex items-center gap-1">
                    <FiStar className="text-amber-400 fill-amber-400 text-xs" /> {supplier.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-borderToken-default flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  toast.success(`Inquiry sent to ${supplier.name}. Representative assigned.`);
                  onContactSupplier?.(supplier);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-black text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FiMail className="text-xs" />
                <span>Contact Supplier</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/category/${supplier.categorySlug}?experience=wholesale`)}
                className="py-2 px-3 rounded-xl bg-surface-background hover:bg-borderToken-light border border-borderToken-default text-xs font-bold text-textColor-primary transition-colors cursor-pointer"
              >
                Catalog
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AlibabaVerifiedSuppliersSection;
