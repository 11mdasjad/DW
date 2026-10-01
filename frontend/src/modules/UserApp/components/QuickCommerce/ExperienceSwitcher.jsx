import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiArrowRight,
  FiShoppingBag,
  FiBox,
  FiPackage,
  FiZap,
  FiClock
} from "react-icons/fi";
import { useExperienceStore } from "../../../../shared/store/experienceStore";
import { useSettingsStore } from "../../../../shared/store/settingsStore";
import { EXPERIENCES } from "../../../../shared/utils/experience";

/**
 * ExperienceSwitcher — Dual Storefront Switcher (Retail Store B2C vs Wholesale Hub B2B)
 * Matches the exact Dwell Mart storefront specification:
 * - Active card in deep amber/gold gradient with black capsule (✓ ACTIVE)
 * - Inactive card in clean card with (Switch →)
 */
const ExperienceSwitcher = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { experience, setExperience } = useExperienceStore();
  const { settings, initialize } = useSettingsStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const quickCommerceEnabled = settings?.features?.quickCommerceEnabled !== false;
  const wholesaleEnabled = settings?.features?.wholesaleMarketplaceEnabled !== false;

  const currentPath = location.pathname;

  const options = [
    {
      value: EXPERIENCES.MARKETPLACE,
      title: "Retail Store",
      subtitle: "Consumer Shopping • Single Items",
      icon: FiShoppingBag,
      tag: "Pan-India",
      tagIcon: FiPackage,
      path: "/retail",
      badge: "B2C",
      isActive:
        currentPath === "/retail" ||
        (currentPath !== "/wholesale" && currentPath !== "/b2b" && experience === EXPERIENCES.MARKETPLACE),
    },
    ...(wholesaleEnabled
      ? [
          {
            value: EXPERIENCES.WHOLESALE,
            title: "Wholesale Hub",
            subtitle: "Bulk Factory Sourcing • MOQ & Tiers",
            icon: FiBox,
            tag: "Bulk / Cargo",
            tagIcon: FiBox,
            path: "/wholesale",
            badge: "B2B",
            isActive:
              currentPath === "/wholesale" ||
              currentPath === "/b2b" ||
              experience === EXPERIENCES.WHOLESALE,
          },
        ]
      : []),
  ];

  if (options.length <= 1) return null;

  const handleSwitch = (option) => {
    setExperience(option.value);
    navigate(option.path);
  };

  return (
    <section className={`w-full px-3 sm:px-6 my-3 sm:my-4 ${className}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {options.map((option) => {
          const isActive = option.isActive;
          const Icon = option.icon;
          const TagIcon = option.tagIcon;

          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => handleSwitch(option)}
              aria-pressed={isActive}
              aria-label={`Select ${option.title} experience`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2 }}
              className={`group relative text-left rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 transition-all duration-200 flex items-center justify-between outline-none cursor-pointer select-none ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20 border-2 border-amber-400 ring-2 ring-amber-400/40"
                  : "bg-surface-card border-2 border-borderToken-default hover:border-amber-400/60 text-textColor-primary hover:shadow-md"
              }`}
            >
              {/* Left Side: Icon + Title & Subtitle */}
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                    isActive
                      ? "bg-amber-600/30 border border-amber-700/20 text-black"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20 group-hover:scale-105"
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h3
                      className={`text-sm sm:text-base font-black tracking-tight truncate ${
                        isActive ? "text-black" : "text-textColor-primary"
                      }`}
                    >
                      {option.title}
                    </h3>

                    {/* Tag badge (Pan-India / Bulk Cargo) */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold ${
                        isActive
                          ? "bg-black/15 text-black border border-black/20"
                          : "bg-surface-background text-textColor-secondary border border-borderToken-default"
                      }`}
                    >
                      <TagIcon className="text-[10px]" />
                      <span>{option.tag}</span>
                    </span>

                    {/* Channel badge (B2C / B2B) */}
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                        isActive
                          ? "bg-black/15 text-black border border-black/20"
                          : option.badge === "B2B"
                          ? "bg-purple-500/15 text-purple-600 border border-purple-500/30"
                          : "bg-blue-500/15 text-blue-600 border border-blue-500/30"
                      }`}
                    >
                      {option.badge}
                    </span>
                  </div>

                  {/* Subtitle */}
                  <p
                    className={`text-xs sm:text-[13px] truncate font-semibold mt-0.5 ${
                      isActive ? "text-black/85 font-bold" : "text-textColor-secondary"
                    }`}
                  >
                    {option.subtitle}
                  </p>
                </div>
              </div>

              {/* Right Side: ACTIVE pill or Switch Button */}
              <div className="shrink-0 ml-3">
                {isActive ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-950 text-amber-400 text-xs font-black uppercase tracking-wider shadow-sm">
                    <FiCheckCircle className="text-emerald-400 text-sm stroke-[2.5]" />
                    <span>ACTIVE</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-full bg-surface-card hover:bg-amber-400/10 border border-borderToken-default hover:border-amber-400/60 text-textColor-primary hover:text-amber-600 text-xs font-bold transition-all shadow-2xs">
                    <span>Switch</span>
                    <FiArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

export default ExperienceSwitcher;
