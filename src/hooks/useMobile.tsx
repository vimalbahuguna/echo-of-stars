import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if running on native mobile platform
    const isNativeMobile = Capacitor.isNativePlatform();
    
    // Check screen size for web browsers
    const checkScreenSize = () => {
      return window.innerWidth < 768;
    };

    const updateMobileState = () => {
      setIsMobile(isNativeMobile || checkScreenSize());
    };

    // Initial check
    updateMobileState();

    // Listen for resize events on web
    if (!isNativeMobile) {
      window.addEventListener('resize', updateMobileState);
      return () => window.removeEventListener('resize', updateMobileState);
    }
  }, []);

  return isMobile;
}

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState({
    platform: 'web',
    isNative: false,
    operatingSystem: 'unknown'
  });

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();
    
    setDeviceInfo({
      platform,
      isNative,
      operatingSystem: platform === 'ios' ? 'iOS' : platform === 'android' ? 'Android' : 'Web'
    });
  }, []);

  return deviceInfo;
}