import { Link } from "react-router-dom";
import {
  FiTrendingUp,
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiArrowRight,
  FiCheckCircle,
  FiPieChart,
  FiBox,
} from "react-icons/fi";

const SELLER_BENEFITS = [
  {
    step: "01",
    title: "Quick Registration",
    desc: "Sign up in 5 minutes with basic GST & business details. Zero onboarding fee.",
  },
  {
    step: "02",
    title: "Dual Selling Channels",
    desc: "List products for retail customers (B2C) or bulk wholesale buyers (B2B).",
  },
  {
    step: "03",
    title: "Automated Fulfillment",
    desc: "Integrated courier tracking, pickup logistics, and pan-India reach.",
  },
  {
    step: "04",
    title: "Fast Payouts & Analytics",
    desc: "Direct-to-bank weekly settlements, transparent fee structures & growth metrics.",
  },
];

const HomeSellerRecruitment = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-[#10223b] via-[#17365D] to-[#0c192c] text-white my-6 relative overflow-hidden">
      {/* Decorative Background Circles */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 -right-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline and Value Proposition */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase tracking-wider">
              <FiTrendingUp className="text-xs" />
              <span>Seller Ecosystem</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              Grow Your Business with Dwell Mart
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg">
              Bring your products to a wider audience and manage your business through one convenient marketplace. Whether you sell retail apparel, electronics, or manufacturer bulk wholesale, reach verified buyers across India.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/sell-on-dwellmart"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>Start Selling Today</span>
                <FiArrowRight />
              </Link>

              <Link
                to="/sell-on-dwellmart"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all hover:scale-105"
              >
                <span>Learn How It Works</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4-Step Onboarding Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {SELLER_BENEFITS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/10 hover:border-amber-400/30 transition-all backdrop-blur-sm group"
              >
                <div className="text-amber-400 font-mono text-sm font-black mb-2 opacity-80 group-hover:opacity-100">
                  {item.step}
                </div>
                <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSellerRecruitment;
