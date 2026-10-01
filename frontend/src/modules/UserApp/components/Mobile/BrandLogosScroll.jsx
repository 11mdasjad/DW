import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCatalogBrands } from '../../data/catalogData';

const getBrandInitials = (name) => {
  if (!name) return 'B';
  const words = String(name).trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const BrandLogosScroll = ({ brands = null }) => {
  const navigate = useNavigate();

  const fallbackBrands = getCatalogBrands();
  const baseBrands = Array.isArray(brands) && brands.length > 0
    ? brands
    : fallbackBrands;

  // Build a continuous duplicated list for seamless, infinite CSS transform marquee
  let uniqueList = [...baseBrands];
  while (uniqueList.length < 12 && baseBrands.length > 0) {
    uniqueList = [...uniqueList, ...baseBrands];
  }
  // Exactly 2 equal halves for the 0% -> -50% loop
  const marqueeBrands = [...uniqueList, ...uniqueList];

  const handleBrandClick = (brand) => {
    const target = brand.id || brand._id || brand.name;
    if (target) {
      navigate(`/brand/${encodeURIComponent(target)}`);
    }
  };

  if (baseBrands.length === 0) return null;

  return (
    <section className="bg-transparent w-full overflow-hidden px-3 sm:px-6 my-4 sm:my-6">
      {/* White container matching Top Brands showcase aesthetic */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100/90 w-full relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
                Top Brands
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 hidden sm:block">
              Shop authentic & verified products directly from premier brands
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* See All link */}
            <button
              onClick={() => navigate('/brands')}
              className="text-xs sm:text-sm font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1 transition-colors group cursor-pointer"
            >
              <span>See All</span>
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Marquee Viewport with subtle edge gradient fades */}
        <div className="relative w-full overflow-hidden py-1">
          {/* Left & Right Subtle Fade Overlays for seamless edge transition */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Continuous Automatic Hardware-Accelerated Marquee Track */}
          <div
            className="brand-marquee-track flex gap-4 sm:gap-6 md:gap-8 items-center py-2"
            style={{ '--marquee-duration': '1200s' }}
          >
            {marqueeBrands.map((brand, index) => {
              const uniqueKey = `${brand.id || brand._id || brand.name}-${index}`;
              const hasValidLogo = Boolean(
                brand.logo &&
                typeof brand.logo === 'string' &&
                !brand.logo.includes('placeholder')
              );

              return (
                <div
                  key={uniqueKey}
                  onClick={() => handleBrandClick(brand)}
                  className="flex-shrink-0 flex flex-col items-center group cursor-pointer w-22 sm:w-26 md:w-28 select-none transition-transform duration-200"
                >
                  {/* Round Shape Circular Container for Brand Logo */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white border-2 border-gray-200/90 group-hover:border-amber-400 p-2.5 sm:p-3 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-105 relative overflow-hidden active:scale-95">
                    {hasValidLogo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain rounded-full transition-transform duration-200 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallbackDiv = e.target.parentElement.querySelector('.brand-monogram');
                          if (fallbackDiv) fallbackDiv.style.display = 'flex';
                        }}
                        loading="lazy"
                      />
                    ) : null}

                    {/* Circular Monogram Fallback Badge in 100% Round Shape */}
                    <div
                      className="brand-monogram w-full h-full rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-100 text-slate-900 font-black text-xs sm:text-sm md:text-base flex items-center justify-center uppercase tracking-wider"
                      style={{ display: hasValidLogo ? 'none' : 'flex' }}
                    >
                      {getBrandInitials(brand.name)}
                    </div>
                  </div>

                  {/* Brand Label Underneath */}
                  <p className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-800 text-center truncate w-full px-1 mt-2 group-hover:text-amber-600 transition-colors">
                    {brand.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogosScroll;
