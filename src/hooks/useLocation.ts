import { useState, useEffect, useCallback } from 'react';
import type { Coordinates, LocationState } from '@/types/weather';

// Demo koordinatlar (Bakü)
const DEFAULT_COORDS: Coordinates = {
  lat: 40.4093,
  lon: 49.8671
};

/**
 * Konum hook'u - Tarayıcı Geolocation API'sini kullanır
 * @returns LocationState
 */
export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    coords: null,
    loading: true,
    error: null,
    permission: null
  });

  /**
   * Konum izni durumunu kontrol et
   */
  const checkPermission = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setState(prev => ({ 
          ...prev, 
          permission: result.state as 'granted' | 'denied' | 'prompt'
        }));
        
        // İzin değişirse güncelle
        result.addEventListener('change', () => {
          setState(prev => ({ 
            ...prev, 
            permission: result.state as 'granted' | 'denied' | 'prompt'
          }));
        });
      } catch (error) {
        console.log('Permission API not supported');
      }
    }
  }, []);

  /**
   * Konum al
   */
  const getLocation = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      // Geolocation desteklenmiyorsa demo konum kullan
      setState({
        coords: DEFAULT_COORDS,
        loading: false,
        error: 'Geolocation desteklenmiyor, demo konum kullanılıyor',
        permission: 'denied'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // Başarılı
      (position) => {
        setState({
          coords: {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          },
          loading: false,
          error: null,
          permission: 'granted'
        });
      },
      // Hata
      (error) => {
        console.error('Geolocation error:', error);
        
        let errorMessage = 'Konum alınamadı';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Konum izni reddedildi';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Konum bilgisi kullanılamıyor';
            break;
          case error.TIMEOUT:
            errorMessage = 'Konum alma zaman aşımına uğradı';
            break;
        }

        // Hata durumunda demo konum kullan
        setState({
          coords: DEFAULT_COORDS,
          loading: false,
          error: errorMessage,
          permission: 'denied'
        });
      },
      // Seçenekler
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 dakika önbellek
      }
    );
  }, []);

  /**
   * Manuel konum ayarla
   */
  const setLocation = useCallback((coords: Coordinates) => {
    setState({
      coords,
      loading: false,
      error: null,
      permission: 'granted'
    });
  }, []);

  // İlk yüklemede konum al
  useEffect(() => {
    checkPermission();
    getLocation();
  }, [checkPermission, getLocation]);

  return {
    ...state,
    getLocation,
    setLocation
  };
};

export default useLocation;
