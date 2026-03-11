// Hava durumu tipleri

// Coordinates
export interface Coordinates {
  lat: number;
  lon: number;
}

// Current weather data
export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  visibility: number;
  uvi: number;
  clouds: number;
  dt: number;
  sunrise: number;
  sunset: number;
  weather: WeatherCondition[];
}

// Weather condition
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

// Hourly forecast
export interface HourlyForecast {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  pop: number; // Probability of precipitation
  weather: WeatherCondition[];
}

// Daily forecast
export interface DailyForecast {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  uvi: number;
  weather: WeatherCondition[];
}

// Full weather response
export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

// City info
export interface CityInfo {
  name: string;
  country: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
}

// Weather state
export interface WeatherState {
  data: WeatherData | null;
  city: CityInfo | null;
  loading: boolean;
  error: string | null;
}

// Location state
export interface LocationState {
  coords: Coordinates | null;
  loading: boolean;
  error: string | null;
  permission: 'granted' | 'denied' | 'prompt' | null;
}

// Clothing advice type
export type ClothingAdvice = 
  | 'veryCold'
  | 'cold'
  | 'cool'
  | 'mild'
  | 'warm'
  | 'hot'
  | 'veryHot'
  | 'rain'
  | 'snow'
  | 'wind';

// Weather theme
export type WeatherTheme = 
  | 'clear'
  | 'cloudy'
  | 'rain'
  | 'snow'
  | 'thunder'
  | 'fog'
  | 'night';

// Theme colors
export interface ThemeColors {
  from: string;
  via: string;
  to: string;
}
