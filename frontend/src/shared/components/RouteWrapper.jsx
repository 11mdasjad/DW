import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useExperienceStore } from '../store/experienceStore';
import { useCategoryStore } from '../store/categoryStore';
import { EXPERIENCES, setExperience as setLocalExperience, getExperience } from '../utils/experience';

/**
 * Wrapper component that ensures consistent route container styling
 * and path-based component lifecycle.
 */
const RouteWrapper = ({ children }) => {
  const location = useLocation();

  // Synchronize active shopping experience & category store when navigating between Wholesale, Retail, and Quick Commerce
  useEffect(() => {
    const pathname = location.pathname || '';

    // Ignore admin, vendor, delivery backoffice routes
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/vendor') ||
      pathname.startsWith('/delivery')
    ) {
      return;
    }

    let targetExp = EXPERIENCES.MARKETPLACE;
    if (
      pathname === '/wholesale' ||
      pathname === '/b2b' ||
      pathname.startsWith('/wholesale/') ||
      pathname.startsWith('/b2b/')
    ) {
      targetExp = EXPERIENCES.WHOLESALE;
    } else if (
      pathname === '/quick' ||
      pathname.startsWith('/quick/')
    ) {
      targetExp = EXPERIENCES.QUICK_COMMERCE;
    } else if (pathname.startsWith('/category/')) {
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get('experience') === 'wholesale') {
        targetExp = EXPERIENCES.WHOLESALE;
      }
    }

    const currentExp = getExperience();
    const storeState = useCategoryStore.getState();
    const loadedExp = storeState.loadedExperience;

    if (currentExp !== targetExp || (loadedExp && loadedExp !== targetExp && loadedExp !== 'all') || storeState.categories.length === 0) {
      setLocalExperience(targetExp);
      useExperienceStore.getState().setExperience(targetExp);
      storeState.initialize(targetExp);
    }
  }, [location.pathname, location.search]);

  // Track SPA pageviews and custom route events with Meta Pixel
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');

      const cleanPath = (location.pathname || '').replace(/\/+$/, '') || '/';
      if (cleanPath === '/vendor/register' || cleanPath === '/sell-on-dwellmart') {
        if (!window.__vendorRegisterPixelTracked) {
          window.fbq('trackCustom', 'VendorRegisterPageVisit');
          window.__vendorRegisterPixelTracked = true;
        }
      } else {
        window.__vendorRegisterPixelTracked = false;
      }
    }
  }, [location.pathname]);

  // Return children with location pathname key to force remount only on distinct path change
  // Without location.search so filter/query updates update in-place rather than unmounting
  return <div key={location.pathname} style={{ width: '100%', height: '100%' }}>{children}</div>;
};

export default RouteWrapper;

