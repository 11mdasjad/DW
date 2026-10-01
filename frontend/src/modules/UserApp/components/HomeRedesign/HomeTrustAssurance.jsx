import { FiTruck, FiRotateCcw, FiShield, FiUsers, FiStar, FiCheck } from "react-icons/fi";
import { Link } from "react-router-dom";

const TRUST_CARDS = [
  {
    icon: FiTruck,
    title: "Pan-India Free Express Shipping",
    desc: "Fast, reliable shipping on all orders over ₹499 with real-time live tracking directly via DTDC and local partners.",
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    icon: FiRotateCcw,
    title: "7-Day Easy Returns & Refunds",
    desc: "100% money back guarantee on defective or mismatched goods with doorstep pickup convenience.",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    icon: FiShield,
    title: "100% Secure & Encrypted Payments",
    desc: "Military-grade 256-bit SSL encrypted checkout supporting UPI, Credit/Debit cards, NetBanking, and Cash on Delivery.",
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    icon: FiUsers,
    title: "Verified Marketplace Sellers",
    desc: "Every manufacturer, vendor, and wholesale supplier is KYC-verified to ensure authentic products and genuine warranties.",
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
];

const HomeTrustAssurance = ({ testimonials = [] }) => {
  const displayTestimonials = Array.isArray(testimonials) && testimonials.length > 0 ? testimonials.slice(0, 3) : [];

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <FiCheck className="text-xs" />
            <span>Marketplace Trust &amp; Assurance</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            Why Hundreds of Thousands Choose Dwell Mart
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            We partner with top-rated sellers to guarantee authentic products, transparent pricing, and instant support.
          </p>
        </div>

        {/* 4 Trust Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-[#F5F7FA] rounded-2xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl mb-4 ${card.color}`}>
                    <Icon />
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customer Testimonials Carousel/Cards (if available) */}
        {displayTestimonials.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200/80">
            <div className="text-center mb-6">
              <h3 className="text-lg sm:text-xl font-black text-gray-900">
                What Our Customers &amp; Retailers Say
              </h3>
              <p className="text-xs text-gray-500">
                Verified reviews from real shoppers and B2B buyers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {displayTestimonials.map((review, idx) => (
                <div
                  key={review.id || idx}
                  className="bg-[#F5F7FA] rounded-2xl p-5 border border-gray-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-amber-400 mb-3">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <FiStar key={i} className="fill-amber-400 text-xs" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-700 italic leading-relaxed line-clamp-4">
                      &quot;{review.message}&quot;
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#17365D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {review.image ? (
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span>{(review.name || "C")[0]}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-gray-900 truncate">
                        {review.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 truncate">
                        {review.designation ? `${review.designation}, ` : ""}{review.company || "Verified Buyer"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeTrustAssurance;
