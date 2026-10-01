import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getCatalogBrands } from '../../data/catalogData';

const getBrandInitials = (name) => {
  if (!name) return 'B';
  const words = String(name).trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const BrandLogosScroll = ({ brands = null }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0, moved: false });

  const fallbackBrands = getCatalogBrands();
  const displayBrands = Array.isArray(brands) && brands.length > 0
    ? brands
    : fallbackBrands;

  // Repeat brands to create a smooth, seamless infinite loop
  const marqueeBrands = displayBrands.length > 0
    ? [...displayBrands, ...displayBrands, ...displayBrands]
    : [];

  // Continuous auto-movement animation
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || displayBrands.length === 0) return;

    let animId;
    const speed = 0.65; // Smooth scroll velocity per frame

    const step = () => {
      if (!isPaused && !isDragging && el) {
        el.scrollLeft += speed;
        // Seamless infinite wrap-around
        if (el.scrollLeft >= el.scrollWidth / 3) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, isDragging, displayBrands.length]);

  // Mouse drag-to-scroll support
  const handleMouseDown = (e) => {
    setIsPaused(true);
    setIsDragging(true);
    const el = scrollRef.current;
    if (!el) return;
    dragStartRef.current = {
      x: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragStartRef.current.x) * 1.5;
    if (Math.abs(walk) > 4) {
      dragStartRef.current.moved = true;
    }
    el.scrollLeft = dragStartRef.current.scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => {
      dragStartRef.current.moved = false;
    }, 50);
  };

  // Click on a brand card
  const handleBrandClick = (brand) => {
    if (dragStartRef.current.moved) return;
    const target = brand.id || brand._id || brand.name;
    if (target) {
      navigate(`/brand/${encodeURIComponent(target)}`);
    }
  };

  // Manual arrow navigation
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  if (displayBrands.length === 0) return null;

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

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Scroll Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-1.5 mr-1">
              <button
                onClick={handleScrollLeft}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-amber-400 text-gray-700 hover:text-amber-600 flex items-center justify-center transition-all shadow-xs active:scale-95"
                aria-label="Previous Brands"
              >
                <FiChevronLeft className="text-base" />
              </button>
              <button
                onClick={handleScrollRight}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-amber-400 text-gray-700 hover:text-amber-600 flex items-center justify-center transition-all shadow-xs active:scale-95"
                aria-label="Next Brands"
              >
                <FiChevronRight className="text-base" />
              </button>
            </div>

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

        {/* Moveable Circular Brands Track */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            if (isDragging) setIsDragging(false);
          }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`w-full overflow-x-auto scrollbar-hide py-2 ${
            isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
          }`}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-4 sm:gap-6 md:gap-7 items-center w-max">
            {marqueeBrands.map((brand, index) => {
              const uniqueKey = `${brand.id || brand._id || brand.name}-${index}`;
              const hasValidLogo = Boolean(brand.logo && typeof brand.logo === 'string' && !brand.logo.includes('placeholder'));

              return (
                <div
                  key={uniqueKey}
                  onClick={() => handleBrandClick(brand)}
                  className="flex-shrink-0 flex flex-col items-center group cursor-pointer w-20 sm:w-24 md:w-28 select-none transition-transform duration-200"
                >
                  {/* Round Shape Container for Brand Logo */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white border-2 border-gray-100 shadow-xs group-hover:shadow-xl group-hover:border-amber-400 group-hover:-translate-y-1 p-2.5 sm:p-3 flex items-center justify-center transition-all duration-300 relative overflow-hidden active:scale-95">
                    {hasValidLogo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallbackDiv = e.target.parentElement.querySelector('.brand-monogram');
                          if (fallbackDiv) fallbackDiv.style.display = 'flex';
                        }}
                        loading="lazy"
                      />
                    ) : null}

                    {/* Circular Monogram Fallback Badge */}
                    <div
                      className="brand-monogram w-full h-full rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-100 text-slate-900 font-black text-xs sm:text-sm md:text-base flex items-center justify-center uppercase tracking-wider shadow-inner"
                      style={{ display: hasValidLogo ? 'none' : 'flex' }}
                    >
                      {getBrandInitials(brand.name)}
                    </div>
                  </div>

                  {/* Brand Label Underneath */}
                  <p className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-700 text-center truncate w-full px-1 mt-2 sm:mt-2.5 group-hover:text-amber-600 transition-colors">
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
