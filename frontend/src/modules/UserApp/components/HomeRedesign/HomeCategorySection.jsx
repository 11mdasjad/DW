import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

const CATEGORIES_DATA = [
  {
    id: "groceries",
    name: "Grocery & Essentials",
    description: "Daily snacks, beverages & dairy",
    tag: "Essential",
    tagColor: "bg-emerald-500",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    link: "/category/groceries",
  },
  {
    id: "fruits-vegetables",
    name: "Fresh Fruits & Vegetables",
    description: "Farm-fresh greens & seasonal fruits",
    tag: "Fresh",
    tagColor: "bg-green-600",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
    link: "/category/fruits-vegetables",
  },
  {
    id: "staples",
    name: "Staples & Grains",
    description: "Atta, rice, dals & pure edible oils",
    tag: "Pantry",
    tagColor: "bg-amber-600",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    link: "/category/staples",
  },
  {
    id: "fashion",
    name: "Fashion & Clothing",
    description: "Men's, women's & festive apparel",
    tag: "Trending",
    tagColor: "bg-pink-600",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
    link: "/category/fashion",
  },
  {
    id: "electronics",
    name: "Electronics & Appliances",
    description: "Smart gadgets, audio & mobile tech",
    tag: "Up to 50% Off",
    tagColor: "bg-blue-600",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    link: "/category/electronics",
  },
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    description: "Cookware, bedsheets & modern decor",
    tag: "Top Picks",
    tagColor: "bg-orange-600",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
    link: "/category/home",
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    description: "Skincare, cosmetics & luxury fragrances",
    tag: "Organic",
    tagColor: "bg-purple-600",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    link: "/category/beauty",
  },
  {
    id: "wellness",
    name: "Health & Wellness",
    description: "Ayurveda, vitamins & fitness essentials",
    tag: "Verified",
    tagColor: "bg-teal-600",
    image:
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80",
    link: "/category/health",
  },
  {
    id: "baby-care",
    name: "Toys & Baby Products",
    description: "Diapers, baby nutrition & safe toys",
    tag: "Gentle Care",
    tagColor: "bg-rose-500",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80",
    link: "/category/toys",
  },
  {
    id: "stationery",
    name: "Books & Stationery",
    description: "School supplies, notebooks & office gear",
    tag: "Academic",
    tagColor: "bg-indigo-600",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    link: "/category/books",
  },
  {
    id: "fitness",
    name: "Sports & Fitness",
    description: "Gym wear, equipment & active footwear",
    tag: "Active",
    tagColor: "bg-red-600",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    link: "/category/sports",
  },
  {
    id: "automotive",
    name: "Automobile Accessories",
    description: "Helmets, car care, tools & lighting",
    tag: "Auto Care",
    tagColor: "bg-slate-700",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    link: "/category/automotive",
  },
];

const HomeCategorySection = () => {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-600">
                Explore Departments
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
              Shop by Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Hand-picked collections across authentic brands and factory-direct suppliers
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#17365D] hover:text-amber-600 transition-colors group shrink-0"
          >
            <span>View All Categories</span>
            <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 12-Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES_DATA.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: idx * 0.03, duration: 0.3 }}
            >
              <Link
                to={cat.link}
                className="group flex flex-col h-full bg-[#F5F7FA] hover:bg-white rounded-2xl p-3 border border-[#E5EAF0] hover:border-amber-400 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Badge Tag */}
                {cat.tag && (
                  <span
                    className={`absolute top-2.5 left-2.5 z-10 text-[9px] font-black uppercase text-white px-2 py-0.5 rounded-full shadow-sm ${cat.tagColor}`}
                  >
                    {cat.tag}
                  </span>
                )}

                {/* Aspect-Ratio Category Image Container */}
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-200 mb-3 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-[13px] text-gray-900 group-hover:text-[#17365D] transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] font-bold text-amber-600 group-hover:text-[#17365D] transition-colors">
                    <span>Explore</span>
                    <FiChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCategorySection;
