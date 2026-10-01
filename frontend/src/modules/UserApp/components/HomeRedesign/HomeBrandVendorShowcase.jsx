import { Link } from "react-router-dom";
import { FiCheckCircle, FiStar, FiArrowRight, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";
import zaraLogo from "../../../../../data/brands/zara.png";
import forever21Logo from "../../../../../data/brands/forever 21.png";
import pumaLogo from "../../../../../data/brands/puma.png";
import levisLogo from "../../../../../data/brands/levi's.png";
import tommyHilfigerLogo from "../../../../../data/brands/Tommy hilfiger.png";
import fabindiaLogo from "../../../../../data/brands/fabindia.png";
import bibaLogo from "../../../../../data/brands/biba.png";
import manyavarLogo from "../../../../../data/brands/manyavar.png";
import allenSollyLogo from "../../../../../data/brands/allen solly.png";
import pantaloonsLogo from "../../../../../data/brands/pantaloons.png";

const BRANDS = [
  { name: "Zara", logo: zaraLogo, link: "/brand/zara" },
  { name: "Levi's", logo: levisLogo, link: "/brand/levis" },
  { name: "Puma", logo: pumaLogo, link: "/brand/puma" },
  { name: "Tommy Hilfiger", logo: tommyHilfigerLogo, link: "/brand/tommy-hilfiger" },
  { name: "Fabindia", logo: fabindiaLogo, link: "/brand/fabindia" },
  { name: "Biba", logo: bibaLogo, link: "/brand/biba" },
  { name: "Manyavar", logo: manyavarLogo, link: "/brand/manyavar" },
  { name: "Allen Solly", logo: allenSollyLogo, link: "/brand/allen-solly" },
  { name: "Pantaloons", logo: pantaloonsLogo, link: "/brand/pantaloons" },
  { name: "Forever 21", logo: forever21Logo, link: "/brand/forever-21" },
];

const HomeBrandVendorShowcase = ({ vendors = [] }) => {
  const displayVendors = Array.isArray(vendors) && vendors.length > 0 ? vendors.slice(0, 4) : [];

  return (
    <section className="py-10 sm:py-14 bg-[#F5F7FA]">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6">
        {/* Brand Pavilion Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">
                  Official Brand Pavilion
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
                Shop 100% Genuine Partner Brands
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Authentic merchandise directly sourced from authorized brand distributors
              </p>
            </div>

            <Link
              to="/brands"
              className="text-xs sm:text-sm font-bold text-[#17365D] hover:text-amber-600 transition-colors flex items-center gap-1 shrink-0"
            >
              <span>Explore All Brands</span>
              <FiArrowRight className="text-xs" />
            </Link>
          </div>

          {/* Brand Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
            {BRANDS.map((brand, idx) => (
              <Link
                key={idx}
                to={brand.link}
                className="bg-white rounded-xl p-3 border border-gray-200 hover:border-amber-400 hover:shadow-md transition-all flex items-center justify-center aspect-[3/2] group"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  loading="lazy"
                  className="max-h-10 max-w-full object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Verified Marketplace Vendors Section */}
        {displayVendors.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  Featured Top-Rated Sellers
                </h3>
                <p className="text-xs text-gray-500">
                  Quality-vetted vendors with exceptional fulfillment speed and high customer ratings
                </p>
              </div>

              <Link
                to="/sellers"
                className="text-xs sm:text-sm font-bold text-[#17365D] hover:text-amber-600 transition-colors flex items-center gap-1"
              >
                <span>Browse All Sellers</span>
                <FiArrowRight className="text-xs" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayVendors.map((vendor, idx) => (
                <div
                  key={vendor.id || idx}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center font-bold text-gray-700 shrink-0">
                      {vendor.storeLogo ? (
                        <img
                          src={vendor.storeLogo}
                          alt={vendor.storeName || "Vendor"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{(vendor.storeName || "V")[0]}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-gray-900 truncate">
                          {vendor.storeName || "Verified Vendor"}
                        </h4>
                        <FiCheckCircle className="text-emerald-600 text-xs shrink-0" title="Verified Seller" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center text-amber-500 font-bold">
                          <FiStar className="fill-amber-400 text-amber-400 text-xs mr-0.5" />
                          {vendor.rating || 4.9}
                        </span>
                        <span>•</span>
                        <span className="text-[11px] text-gray-400">{vendor.reviewCount || 120}+ reviews</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/seller/${vendor.id}`}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-[#17365D] hover:text-white text-gray-600 transition-colors text-xs font-bold shrink-0"
                    title="Visit Store"
                  >
                    <FiArrowRight />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeBrandVendorShowcase;
