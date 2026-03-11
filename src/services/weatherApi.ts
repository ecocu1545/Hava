import axios from 'axios';
import type { 
  WeatherData, 
  CityInfo, 
  Coordinates 
} from '@/types/weather';

// Open-Meteo API - Ücretsiz, API anahtarı gerektirmez!
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// WMO hava durumu kodlarını OpenWeatherMap formatına dönüştür
const wmoToOpenWeather = (wmoCode: number): { id: number; main: string; description: string; icon: string } => {
  const codeMap: Record<number, { id: number; main: string; description: string; icon: string }> = {
    0: { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
    1: { id: 801, main: 'Clouds', description: 'mainly clear', icon: '02d' },
    2: { id: 802, main: 'Clouds', description: 'partly cloudy', icon: '03d' },
    3: { id: 804, main: 'Clouds', description: 'overcast', icon: '04d' },
    45: { id: 741, main: 'Fog', description: 'fog', icon: '50d' },
    48: { id: 741, main: 'Fog', description: 'depositing rime fog', icon: '50d' },
    51: { id: 300, main: 'Drizzle', description: 'light drizzle', icon: '09d' },
    53: { id: 301, main: 'Drizzle', description: 'moderate drizzle', icon: '09d' },
    55: { id: 302, main: 'Drizzle', description: 'dense drizzle', icon: '09d' },
    61: { id: 500, main: 'Rain', description: 'slight rain', icon: '10d' },
    63: { id: 501, main: 'Rain', description: 'moderate rain', icon: '10d' },
    65: { id: 502, main: 'Rain', description: 'heavy rain', icon: '10d' },
    71: { id: 600, main: 'Snow', description: 'slight snow', icon: '13d' },
    73: { id: 601, main: 'Snow', description: 'moderate snow', icon: '13d' },
    75: { id: 602, main: 'Snow', description: 'heavy snow', icon: '13d' },
    77: { id: 611, main: 'Snow', description: 'snow grains', icon: '13d' },
    80: { id: 520, main: 'Rain', description: 'slight rain showers', icon: '09d' },
    81: { id: 521, main: 'Rain', description: 'moderate rain showers', icon: '09d' },
    82: { id: 522, main: 'Rain', description: 'violent rain showers', icon: '09d' },
    85: { id: 620, main: 'Snow', description: 'slight snow showers', icon: '13d' },
    86: { id: 621, main: 'Snow', description: 'heavy snow showers', icon: '13d' },
    95: { id: 200, main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' },
    96: { id: 201, main: 'Thunderstorm', description: 'thunderstorm with hail', icon: '11d' },
    99: { id: 202, main: 'Thunderstorm', description: 'thunderstorm with heavy hail', icon: '11d' }
  };
  
  return codeMap[wmoCode] || { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' };
};

// Gece ikonu mu kontrol et
const isNightTime = (hour: number): boolean => {
  return hour < 6 || hour >= 20;
};

/**
 * Open-Meteo API'den hava durumu verilerini getir
 * @param coords - Koordinatlar
 * @returns WeatherData
 */
export const getWeatherData = async (coords: Coordinates): Promise<WeatherData> => {
  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        latitude: coords.lat,
        longitude: coords.lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,wind_direction_10m,weather_code,cloud_cover,visibility',
        hourly: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation_probability,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max',
        timezone: 'auto',
        forecast_days: 8
      }
    });

    const data = response.data;
    const now = Math.floor(Date.now() / 1000);
    const currentHour = new Date().getHours();
    const isNight = isNightTime(currentHour);

    // Current weather
    const currentWeather = wmoToOpenWeather(data.current.weather_code);
    if (isNight) {
      currentWeather.icon = currentWeather.icon.replace('d', 'n');
    }

    const current = {
      dt: now,
      temp: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      pressure: data.current.pressure_msl,
      wind_speed: data.current.wind_speed_10m,
      wind_deg: data.current.wind_direction_10m,
      visibility: (data.current.visibility || 10000) / 1000, // km cinsinden
      uvi: 0, // Open-Meteo'da ücretsiz planda yok
      clouds: data.current.cloud_cover,
      sunrise: Math.floor(new Date(data.daily.sunrise[0]).getTime() / 1000),
      sunset: Math.floor(new Date(data.daily.sunset[0]).getTime() / 1000),
      weather: [currentWeather]
    };

    // Hourly forecast (24 hours)
    const hourly = data.hourly.time.slice(0, 24).map((time: string, i: number) => {
      const hour = new Date(time).getHours();
      const isHourNight = isNightTime(hour);
      const weather = wmoToOpenWeather(data.hourly.weather_code[i]);
      if (isHourNight) {
        weather.icon = weather.icon.replace('d', 'n');
      }

      return {
        dt: Math.floor(new Date(time).getTime() / 1000),
        temp: data.hourly.temperature_2m[i],
        feels_like: data.hourly.apparent_temperature[i],
        humidity: data.hourly.relative_humidity_2m[i],
        wind_speed: data.hourly.wind_speed_10m[i],
        pop: (data.hourly.precipitation_probability[i] || 0) / 100,
        weather: [weather]
      };
    });

    // Daily forecast (7 days)
    const daily = data.daily.time.slice(0, 7).map((time: string, i: number) => {
      const weather = wmoToOpenWeather(data.daily.weather_code[i]);
      
      return {
        dt: Math.floor(new Date(time).getTime() / 1000),
        sunrise: Math.floor(new Date(data.daily.sunrise[i]).getTime() / 1000),
        sunset: Math.floor(new Date(data.daily.sunset[i]).getTime() / 1000),
        moonrise: 0,
        moonset: 0,
        moon_phase: 0,
        temp: {
          day: data.daily.temperature_2m_max[i],
          min: data.daily.temperature_2m_min[i],
          max: data.daily.temperature_2m_max[i],
          night: data.daily.temperature_2m_min[i],
          eve: data.daily.temperature_2m_max[i],
          morn: data.daily.temperature_2m_min[i]
        },
        feels_like: {
          day: data.daily.temperature_2m_max[i],
          night: data.daily.temperature_2m_min[i],
          eve: data.daily.temperature_2m_max[i],
          morn: data.daily.temperature_2m_min[i]
        },
        pressure: data.current.pressure_msl,
        humidity: data.current.relative_humidity_2m,
        wind_speed: data.daily.wind_speed_10m_max[i],
        wind_deg: 0,
        clouds: data.current.cloud_cover,
        pop: (data.daily.precipitation_probability_max[i] || 0) / 100,
        uvi: 0,
        weather: [weather]
      };
    });

    return {
      lat: coords.lat,
      lon: coords.lon,
      timezone: data.timezone,
      timezone_offset: data.utc_offset_seconds,
      current,
      hourly,
      daily
    };
  } catch (error) {
    console.error('Open-Meteo API error:', error);
    throw new Error('Hava durumu verileri alınamadı');
  }
};

/**
 * Open-Meteo Geocoding API'den şehir bilgilerini getir
 * @param coords - Koordinatlar
 * @returns CityInfo
 */
export const getCityName = async (coords: Coordinates): Promise<CityInfo> => {
  try {
    // Open-Meteo'da reverse geocoding yok, BigDataCloud kullanacağız (ücretsiz)
    const response = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      params: {
        latitude: coords.lat,
        longitude: coords.lon,
        localityLanguage: 'tr'
      }
    });

    const data = response.data;
    
    return {
      name: data.city || data.locality || 'Bilinmeyen Şehir',
      country: data.countryCode || 'XX',
      lat: coords.lat,
      lon: coords.lon,
      local_names: {
        tr: data.city || data.locality,
        en: data.city || data.locality
      }
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    // Hata durumunda koordinatlara göre varsayılan şehir
    return getDefaultCity(coords);
  }
};

/**
 * Koordinatlara göre varsayılan şehir
 */
const getDefaultCity = (coords: Coordinates): CityInfo => {
  const cities: Record<string, CityInfo> = {
    '40.4093:49.8671': {
      name: 'Bakı',
      country: 'AZ',
      lat: 40.4093,
      lon: 49.8671,
      local_names: { az: 'Bakı', tr: 'Bakü', en: 'Baku' }
    },
    '41.0082:28.9784': {
      name: 'İstanbul',
      country: 'TR',
      lat: 41.0082,
      lon: 28.9784,
      local_names: { az: 'İstanbul', tr: 'İstanbul', en: 'Istanbul' }
    },
    '39.9334:32.8597': {
      name: 'Ankara',
      country: 'TR',
      lat: 39.9334,
      lon: 32.8597,
      local_names: { az: 'Ankara', tr: 'Ankara', en: 'Ankara' }
    },
    '51.5074:-0.1278': {
      name: 'London',
      country: 'GB',
      lat: 51.5074,
      lon: -0.1278,
      local_names: { az: 'London', tr: 'Londra', en: 'London' }
    },
    '40.7128:-74.0060': {
      name: 'New York',
      country: 'US',
      lat: 40.7128,
      lon: -74.0060,
      local_names: { az: 'Nyu York', tr: 'New York', en: 'New York' }
    }
  };

  const key = `${coords.lat.toFixed(4)}:${coords.lon.toFixed(4)}`;
  return cities[key] || {
    name: 'Bilinmeyen Şehir',
    country: 'XX',
    lat: coords.lat,
    lon: coords.lon,
    local_names: {
      tr: 'Bilinmeyen Şehir',
      en: 'Unknown City'
    }
  };
};

/**
 * Open-Meteo Geocoding API'den şehir ara
 * @param query - Arama sorgusu
 * @returns CityInfo array
 */
export const searchCity = async (query: string): Promise<CityInfo[]> => {
  try {
    const response = await axios.get(GEO_URL, {
      params: {
        name: query,
        count: 5,
        language: 'tr',
        format: 'json'
      }
    });

    if (!response.data.results) {
      return [];
    }

    return response.data.results.map((result: any) => ({
      name: result.name,
      country: result.country_code || 'XX',
      lat: result.latitude,
      lon: result.longitude,
      local_names: {
        tr: result.name,
        en: result.name
      }
    }));
  } catch (error) {
    console.error('City search error:', error);
    // Hata durumunda mock arama
    return mockCitySearch(query);
  }
};

/**
 * Mock şehir arama (API hatası durumunda)
 */
const mockCitySearch = (query: string): CityInfo[] => {
  const mockCities: CityInfo[] = [
    { name: 'Bakı', country: 'AZ', lat: 40.4093, lon: 49.8671, local_names: { az: 'Bakı', tr: 'Bakü', en: 'Baku' } },
    { name: 'İstanbul', country: 'TR', lat: 41.0082, lon: 28.9784, local_names: { az: 'İstanbul', tr: 'İstanbul', en: 'Istanbul' } },
    { name: 'Ankara', country: 'TR', lat: 39.9334, lon: 32.8597, local_names: { az: 'Ankara', tr: 'Ankara', en: 'Ankara' } },
    { name: 'İzmir', country: 'TR', lat: 38.4237, lon: 27.1428, local_names: { az: 'İzmir', tr: 'İzmir', en: 'Izmir' } },
    { name: 'Antalya', country: 'TR', lat: 36.8969, lon: 30.7133, local_names: { az: 'Antalya', tr: 'Antalya', en: 'Antalya' } },
    { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278, local_names: { az: 'London', tr: 'Londra', en: 'London' } },
    { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060, local_names: { az: 'Nyu York', tr: 'New York', en: 'New York' } },
    { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522, local_names: { az: 'Paris', tr: 'Paris', en: 'Paris' } },
    { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050, local_names: { az: 'Berlin', tr: 'Berlin', en: 'Berlin' } },
    { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503, local_names: { az: 'Tokyo', tr: 'Tokyo', en: 'Tokyo' } },
    { name: 'Dubai', country: 'AE', lat: 25.2048, lon: 55.2708, local_names: { az: 'Dubai', tr: 'Dubai', en: 'Dubai' } },
    { name: 'Moscow', country: 'RU', lat: 55.7558, lon: 37.6173, local_names: { az: 'Moskva', tr: 'Moskova', en: 'Moscow' } }
  ];

  const lowerQuery = query.toLowerCase();
  return mockCities.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) ||
    city.local_names?.tr?.toLowerCase().includes(lowerQuery) ||
    city.local_names?.az?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Hava durumu ikon URL'si oluştur
 * OpenWeatherMap ikonlarını kullan
 */
export const getWeatherIconUrl = (iconCode: string, size: '1x' | '2x' | '4x' = '2x'): string => {
  const sizeMap = {
    '1x': '',
    '2x': '@2x',
    '4x': '@4x'
  };
  return `https://openweathermap.org/img/wn/${iconCode}${sizeMap[size]}.png`;
};
