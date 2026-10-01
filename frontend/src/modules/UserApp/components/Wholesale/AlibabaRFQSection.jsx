import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiCheckCircle,
  FiBox,
  FiClock,
  FiShield,
  FiFileText,
  FiChevronRight,
  FiLayers,
  FiHelpCircle,
  FiTrash2,
  FiRefreshCw
} from "react-icons/fi";
import toast from "react-hot-toast";

const RFQ_STORAGE_KEY = "dwellmart_wholesale_rfqs";

const SAMPLE_INITIAL_RFQS = [
  {
    id: "rfq-sample-1",
    productName: "100% Combed Cotton Bio-Washed T-Shirts (180 GSM)",
    category: "Clothing & Apparel",
    quantity: "500",
    unit: "Pieces",
    targetPrice: "₹185 / pc",
    details: "Custom neck labels, individual polybag packing, assorted sizes S to XXL.",
    status: "3 Quotes Received",
    statusColor: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30",
    submittedAt: "Yesterday",
  },
  {
    id: "rfq-sample-2",
    productName: "Heavy Duty 5-Ply Corrugated Shipping Cartons",
    category: "Packaging & Boxes",
    quantity: "50",
    unit: "Cartons",
    targetPrice: "₹42 / box",
    details: "Universal dimensions 14x10x8 inch, 150 GSM kraft paper, bundle wrapped.",
    status: "Matching Manufacturers",
    statusColor: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
    submittedAt: "3 days ago",
  },
];

/**
 * AlibabaRFQSection
 *
 * Interactive Request for Quotation (RFQ) portal in the authentic style of Alibaba.com:
 * - "One Request, Multiple Quotes"
 * - Dynamic form for wholesale product sourcing
 * - Saved inquiry tracking in localStorage
 * - Verified supplier matching simulation
 */
const AlibabaRFQSection = ({ prefilledCategory = "" }) => {
  const [activeTab, setActiveTab] = useState("form"); // "form" | "my-rfqs"
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState(prefilledCategory || "Apparel & Accessories");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Pieces");
  const [targetPrice, setTargetPrice] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const [rfqs, setRfqs] = useState(() => {
    try {
      const stored = localStorage.getItem(RFQ_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return SAMPLE_INITIAL_RFQS;
  });

  useEffect(() => {
    if (prefilledCategory) {
      setCategory(prefilledCategory);
    }
  }, [prefilledCategory]);

  const handleSaveRfqs = (updated) => {
    setRfqs(updated);
    try {
      localStorage.setItem(RFQ_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast.error("Please enter the product or item you wish to source.");
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      toast.error("Please enter your estimated required quantity.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newRfq = {
        id: `rfq-${Date.now()}`,
        productName: productName.trim(),
        category,
        quantity: quantity.trim(),
        unit,
        targetPrice: targetPrice.trim() ? `₹${targetPrice.trim()} / ${unit.toLowerCase()}` : "Open to quote",
        details: details.trim() || "Standard commercial wholesale grade specifications.",
        status: "Matching 5 Verified Manufacturers",
        statusColor: "bg-blue-500/15 text-blue-600 border border-blue-500/30",
        submittedAt: "Just now",
      };

      const updated = [newRfq, ...rfqs];
      handleSaveRfqs(updated);

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      toast.success("RFQ submitted! Verified manufacturers will review your request.");

      // Reset form fields
      setProductName("");
      setQuantity("");
      setTargetPrice("");
      setDetails("");

      setTimeout(() => {
        setSubmittedSuccess(false);
        setActiveTab("my-rfqs");
      }, 1500);
    }, 700);
  };

  const handleDeleteRfq = (id) => {
    const updated = rfqs.filter((r) => r.id !== id);
    handleSaveRfqs(updated);
    toast.success("Sourcing request removed.");
  };

  return (
    <section id="wholesale-rfq-portal" className="w-full max-w-7xl mx-auto px-3 sm:px-6 my-8 sm:my-10">
      <div className="rounded-3xl bg-surface-card border border-borderToken-default shadow-card overflow-hidden">

        {/* ── Top Header Banner ── */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md text-amber-200 text-xs font-black uppercase tracking-wider mb-2">
                <FiSend className="text-xs" />
                <span>Alibaba.com Style RFQ Hub</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                One Request, Multiple Factory Quotes
              </h2>
              <p className="text-xs sm:text-sm text-white/90 font-medium mt-1">
                Tell verified Indian mills and manufacturers what you need. Receive custom volume quotes within 24 hours.
              </p>
            </div>

            {/* Tab switchers: Post RFQ vs My RFQs */}
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 self-start md:self-center shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("form")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === "form"
                    ? "bg-amber-400 text-black shadow-md"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Post New RFQ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("my-rfqs")}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "my-rfqs"
                    ? "bg-amber-400 text-black shadow-md"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <span>My Inquiries</span>
                <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] text-amber-300 font-bold">
                  {rfqs.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Content Area: Form or My RFQs ── */}
        <div className="p-5 sm:p-8">
          {activeTab === "form" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* RFQ Form */}
              <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Product Sourcing Requirement */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-textColor-primary uppercase tracking-wider mb-1.5">
                      What product or lot do you want to source? <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. 100% Cotton Bio-Washed T-Shirts or 5-Ply Shipping Cartons"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-surface-background border border-borderToken-default text-sm text-textColor-primary placeholder:text-textColor-muted focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                    />
                  </div>

                  {/* Sourcing Category */}
                  <div>
                    <label className="block text-xs font-black text-textColor-primary uppercase tracking-wider mb-1.5">
                      Sourcing Industry
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl bg-surface-background border border-borderToken-default text-sm text-textColor-primary focus:outline-none focus:border-amber-500 transition-all font-medium"
                    >
                      <option value="Apparel & Accessories">Apparel & Accessories</option>
                      <option value="Consumer Electronics">Consumer Electronics</option>
                      <option value="Home, Kitchen & Living">Home, Kitchen & Living</option>
                      <option value="Footwear & Leather Bags">Footwear & Leather Bags</option>
                      <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                      <option value="Packaging & Printing">Packaging & Printing</option>
                      <option value="Industrial & Hardware">Industrial & Hardware</option>
                      <option value="Other Wholesale Sourcing">Other Wholesale Sourcing</option>
                    </select>
                  </div>

                  {/* Sourcing Quantity & Unit */}
                  <div>
                    <label className="block text-xs font-black text-textColor-primary uppercase tracking-wider mb-1.5">
                      Estimated Sourcing Quantity <span className="text-amber-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 200"
                        required
                        className="w-2/3 px-4 py-3 rounded-xl bg-surface-background border border-borderToken-default text-sm text-textColor-primary placeholder:text-textColor-muted focus:outline-none focus:border-amber-500 transition-all font-medium"
                      />
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-1/3 px-2 py-3 rounded-xl bg-surface-background border border-borderToken-default text-xs text-textColor-primary focus:outline-none focus:border-amber-500 font-bold"
                      >
                        <option value="Pieces">Pieces</option>
                        <option value="Cartons">Cartons</option>
                        <option value="Pallets">Pallets</option>
                        <option value="Sets">Sets</option>
                        <option value="Kg">Kg</option>
                      </select>
                    </div>
                  </div>

                  {/* Target FOB / Price per Unit (Optional) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-textColor-primary uppercase tracking-wider mb-1.5">
                      Target Price per Unit (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-textColor-muted">
                        ₹
                      </span>
                      <input
                        type="text"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        placeholder="e.g. 195 (leave empty for open supplier bidding)"
                        className="w-full pl-8 pr-4 py-3 rounded-xl bg-surface-background border border-borderToken-default text-sm text-textColor-primary placeholder:text-textColor-muted focus:outline-none focus:border-amber-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Detailed Specifications */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-textColor-primary uppercase tracking-wider mb-1.5">
                      Detailed Specifications & Branding Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Specify sizes, materials, GSM, colors, custom logo embroidery, packaging instructions, or target delivery timeline..."
                      className="w-full px-4 py-3 rounded-xl bg-surface-background border border-borderToken-default text-sm text-textColor-primary placeholder:text-textColor-muted focus:outline-none focus:border-amber-500 transition-all font-medium resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || submittedSuccess}
                    className="px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-black font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <FiRefreshCw className="animate-spin text-base" />
                        <span>Transmitting to Verified Mills...</span>
                      </>
                    ) : submittedSuccess ? (
                      <>
                        <FiCheckCircle className="text-emerald-800 text-base" />
                        <span>Submitted Successfully!</span>
                      </>
                    ) : (
                      <>
                        <FiSend className="text-base" />
                        <span>Submit Sourcing Request (RFQ)</span>
                      </>
                    )}
                  </button>

                  <span className="text-xs text-textColor-muted font-medium hidden sm:inline-block">
                    ⚡ Free to submit • 100% Privacy Protected
                  </span>
                </div>
              </form>

              {/* Sourcing Benefits Column */}
              <div className="lg:col-span-4 bg-surface-background rounded-2xl border border-borderToken-default p-5 space-y-4">
                <h4 className="text-sm font-black text-textColor-primary uppercase tracking-wider">
                  How Dwell Mart RFQ Works
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-textColor-primary">Submit Your Specifics</h5>
                      <p className="text-[11px] text-textColor-muted mt-0.5">
                        Tell us exact volumes, materials, and price target in 30 seconds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-textColor-primary">Algorithm Matches Mills</h5>
                      <p className="text-[11px] text-textColor-muted mt-0.5">
                        Dispatched only to ISO-certified Indian mills with active capacity.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-textColor-primary">Compare & Lock Order</h5>
                      <p className="text-[11px] text-textColor-muted mt-0.5">
                        Compare manufacturer quotes and book with full Trade Assurance protection.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-borderToken-default/70 flex items-center gap-2 text-xs text-textColor-secondary font-medium">
                  <FiShield className="text-emerald-500 text-sm shrink-0" />
                  <span>Trade Assurance 100% money-back escrow</span>
                </div>
              </div>

            </div>
          ) : (
            /* My RFQs List Tab */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-borderToken-default">
                <div>
                  <h4 className="text-sm font-black text-textColor-primary">
                    Active Sourcing Inquiries ({rfqs.length})
                  </h4>
                  <p className="text-xs text-textColor-muted">
                    Track factory quotes and supplier communication
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-black text-xs font-black transition-colors cursor-pointer"
                >
                  + Post Another Request
                </button>
              </div>

              {rfqs.length === 0 ? (
                <div className="text-center py-10">
                  <FiFileText className="text-3xl text-textColor-muted mx-auto mb-2" />
                  <p className="text-sm font-bold text-textColor-primary">No active sourcing requests yet</p>
                  <p className="text-xs text-textColor-muted mt-1">Post an RFQ to get bulk quotes from verified mills.</p>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {rfqs.map((rfq) => (
                    <div
                      key={rfq.id}
                      className="p-4 rounded-2xl bg-surface-background border border-borderToken-default flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${rfq.statusColor || "bg-amber-500/15 text-amber-600"}`}>
                            {rfq.status}
                          </span>
                          <span className="text-[10px] text-textColor-muted">
                            Submitted {rfq.submittedAt}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-borderToken-default text-textColor-secondary">
                            {rfq.category}
                          </span>
                        </div>
                        <h5 className="text-sm font-black text-textColor-primary">
                          {rfq.productName}
                        </h5>
                        <p className="text-xs text-textColor-secondary font-medium">
                          Quantity: <span className="font-bold text-textColor-primary">{rfq.quantity} {rfq.unit}</span> • Target: <span className="font-bold text-amber-500">{rfq.targetPrice}</span>
                        </p>
                        {rfq.details && (
                          <p className="text-[11px] text-textColor-muted line-clamp-1 italic">
                            "{rfq.details}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => toast.success("Connected with supplier representative.")}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-600 text-xs font-black transition-colors cursor-pointer"
                        >
                          View Quotes
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRfq(rfq.id)}
                          className="p-2 rounded-xl text-textColor-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete Request"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default AlibabaRFQSection;
