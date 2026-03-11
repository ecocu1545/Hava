import { useState, useEffect, useCallback } from 'react';
import { getWeatherData, getCityName, searchCity } from '@/services/weatherApi';
import type { 
  CityInfo, 
  Coordinates, 
  WeatherState,
  ClothingAdvice,
  WeatherTheme,
  ThemeColors
} from '@/types/weather';

/**
 * Hava durumu hook'u
 * @param coords - Koordinatlar
 * @returns WeatherState ve yardımcı fonksiyonlar
 */
export const useWeather = (coords: Coordinates | null) => {
  const [state, setState] = useState<WeatherState>({
    data: null,
    city: null,
    loading: false,
    error: null
  });

  const [searchResults, setSearchResults] = useState<CityInfo[]>([]);
  const [searching, setSearching] = useState(false);

  /**
   * Hava durumu verilerini getir
   */
  const fetchWeather = useCallback(async (coordinates: Coordinates) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Paralel olarak hem hava durumu hem şehir bilgisi getir
      const [weatherData, cityData] = await Promise.all([
        getWeatherData(coordinates),
        getCityName(coordinates)
      ]);

      setState({
        data: weatherData,
        city: cityData,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Hava durumu verileri alınamadı'
      }));
    }
  }, []);

  /**
   * Şehir ara
   */
  const searchCities = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchCity(query);
      setSearchResults(results);
    } catch (error) {
      console.error('City search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  /**
   * Şehir seç
   */
  const selectCity = useCallback(async (city: CityInfo) => {
    setSearchResults([]);
    await fetchWeather({ lat: city.lat, lon: city.lon });
  }, [fetchWeather]);

  // Koordinat değiştiğinde hava durumunu getir
  useEffect(() => {
    if (coords) {
      fetchWeather(coords);
    }
  }, [coords, fetchWeather]);

  /**
   * Giyinme tavsiyesi belirle
   */
  const getClothingAdvice = useCallback((): ClothingAdvice | null => {
    if (!state.data) return null;

    const temp = state.data.current.temp;
    const weatherId = state.data.current.weather[0]?.id;
    const windSpeed = state.data.current.wind_speed;

    // Hava durumu koşullarına göre tavsiye
    if (weatherId >= 200 && weatherId < 300) return 'rain'; // Fırtına
    if (weatherId >= 500 && weatherId < 600) return 'rain'; // Yağmur
    if (weatherId >= 600 && weatherId < 700) return 'snow'; // Kar
    if (weatherId >= 700 && weatherId < 800) return 'wind'; // Sis/rüzgar
    if (windSpeed > 10) return 'wind'; // Kuvvetli rüzgar

    // Sıcaklığa göre tavsiye
    if (temp < -5) return 'veryCold';
    if (temp < 10) return 'cold';
    if (temp < 15) return 'cool';
    if (temp < 22) return 'mild';
    if (temp < 28) return 'warm';
    if (temp < 35) return 'hot';
    return 'veryHot';
  }, [state.data]);

  /**
   * Hava durumu temasını belirle
   */
  const getWeatherTheme = useCallback((): WeatherTheme => {
    if (!state.data) return 'clear';

    const weatherId = state.data.current.weather[0]?.id;
    const icon = state.data.current.weather[0]?.icon;
    const isNight = icon?.endsWith('n');

    if (isNight) return 'night';
    if (weatherId >= 200 && weatherId < 300) return 'thunder';
    if (weatherId >= 300 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId >= 700 && weatherId < 800) return 'fog';
    if (weatherId === 800) return 'clear';
    if (weatherId > 800 && weatherId < 803) return 'cloudy';
    return 'cloudy';
  }, [state.data]);

  /**
   * Tema renklerini getir
   */
  const getThemeColors = useCallback((): ThemeColors => {
    const theme = getWeatherTheme();
    const hour = new Date().getHours();
    const isEvening = hour >= 18 || hour < 6;

    const themes: Record<WeatherTheme, ThemeColors> = {
      clear: isEvening 
        ? { from: 'from-orange-400', via: 'via-purple-500', to: 'to-indigo-900' }
        : { from: 'from-sky-400', via: 'via-blue-500', to: 'to-blue-600' },
      cloudy: isEvening
        ? { from: 'from-slate-400', via: 'via-slate-500', to: 'to-slate-700' }
        : { from: 'from-blue-300', via: 'via-blue-400', to: 'to-slate-400' },
      rain: { from: 'from-slate-600', via: 'via-slate-700', to: 'to-slate-800' },
      snow: { from: 'from-slate-300', via: 'via-blue-200', to: 'to-slate-400' },
      thunder: { from: 'from-slate-700', via: 'via-purple-800', to: 'to-slate-900' },
      fog: { from: 'from-gray-400', via: 'via-gray-500', to: 'to-gray-600' },
      night: { from: 'from-indigo-900', via: 'via-purple-900', to: 'to-slate-900' }
    };

    return themes[theme];
  }, [getWeatherTheme]);

  /**
   * Gün adını getir (i18n için)
   */
  const getDayName = useCallback((timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }, []);

  /**
   * Saat formatla
   */
  const formatTime = useCallback((timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  /**
   * Sıcaklık formatla
   */
  const formatTemp = useCallback((temp: number): string => {
    return Math.round(temp).toString();
  }, []);

  return {
    ...state,
    searchResults,
    searching,
    fetchWeather,
    searchCities,
    selectCity,
    getClothingAdvice,
    getWeatherTheme,
    getThemeColors,
    getDayName,
    formatTime,
    formatTemp
  };
};

export default useWeather;
