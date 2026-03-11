import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Droplets, Wind, Eye, Gauge, Sun, Cloud } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import type { WeatherData, CityInfo } from '@/types/weather';

interface HeroSectionProps {
  weather: WeatherData;
  city: CityInfo | null;
  formatTemp: (temp: number) => string;
  formatTime: (timestamp: number) => string;
  getConditionKey: (weatherId: number) => string;
}

/**
 * Hero Bölümü Bileşeni
 * Ana hava durumu bilgilerini büyük puntolarla gösterir
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  weather,
  city,
  formatTemp,
  formatTime,
  getConditionKey
}) => {
  const { t, i18n } = useTranslation();
  const current = weather.current;
  const language = i18n.language;

  // Şehir adını diline göre getir
  const getCityName = () => {
    if (!city) return t('location.search');
    
    // Yerel isimler varsa, seçili dile göre göster
    if (city.local_names) {
      const localName = city.local_names[language];
      if (localName) return localName;
    }
    
    return city.name;
  };

  // Hava durumu açıklamasını getir
  const getWeatherDescription = () => {
    const conditionKey = getConditionKey(current.weather[0]?.id);
    return t(`conditions.${conditionKey}`);
  };

  // Detay kartı bileşeni
  const DetailCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    unit?: string;
  }> = ({ icon, label, value, unit }) => (
    <div className="glass-card rounded-xl p-3 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/10">
        {icon}
      </div>
      <div>
        <p className="text-xs text-white/60">{label}</p>
        <p className="text-sm font-semibold text-white">
          {value}{unit && <span className="text-white/70 ml-0.5">{unit}</span>}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Üst kısım - Şehir ve Tarih */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-white/80" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {getCityName()}
            </h1>
          </div>
          <p className="text-white/60 text-sm ml-7">
            {new Date().toLocaleDateString(language === 'en' ? 'en-US' : language === 'az' ? 'az-AZ' : 'tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Ana Hava Durumu */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        {/* Sol - Sıcaklık ve İkon */}
        <div className="flex items-center gap-4 md:gap-6">
          <WeatherIcon
            iconCode={current.weather[0]?.icon}
            weatherId={current.weather[0]?.id}
            size="xl"
            className="text-yellow-300"
            animated={true}
          />
          <div>
            <div className="flex items-start">
              <span className="text-6xl md:text-7xl font-bold text-white tracking-tight">
                {formatTemp(current.temp)}
              </span>
              <span className="text-3xl md:text-4xl font-light text-white/80 mt-2">°</span>
            </div>
            <p className="text-lg text-white/80 capitalize">
              {getWeatherDescription()}
            </p>
          </div>
        </div>

        {/* Sağ - Hissedilen ve Ek Bilgiler */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-white/70">
            {t('weather.feelsLike')}: 
            <span className="text-white font-semibold ml-1">
              {formatTemp(current.feels_like)}°
            </span>
          </p>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span>↑ {formatTemp(weather.daily[0]?.temp.max || 0)}°</span>
            <span>↓ {formatTemp(weather.daily[0]?.temp.min || 0)}°</span>
          </div>
        </div>
      </div>

      {/* Detay Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DetailCard
          icon={<Droplets className="w-4 h-4 text-blue-300" />}
          label={t('weather.humidity')}
          value={current.humidity.toString()}
          unit="%"
        />
        <DetailCard
          icon={<Wind className="w-4 h-4 text-cyan-300" />}
          label={t('weather.wind')}
          value={current.wind_speed.toFixed(1)}
          unit=" m/s"
        />
        <DetailCard
          icon={<Gauge className="w-4 h-4 text-emerald-300" />}
          label={t('weather.pressure')}
          value={current.pressure.toString()}
          unit=" hPa"
        />
        <DetailCard
          icon={<Eye className="w-4 h-4 text-violet-300" />}
          label={t('weather.visibility')}
          value={(current.visibility / 1000).toFixed(1)}
          unit=" km"
        />
      </div>

      {/* Gün Doğuşu/Batışı */}
      <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-white/70">
            {t('weather.sunrise')}: 
            <span className="text-white ml-1">{formatTime(current.sunrise)}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white/70">
            {t('weather.sunset')}: 
            <span className="text-white ml-1">{formatTime(current.sunset)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
