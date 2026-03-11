import React from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Wind, ChevronRight } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import type { DailyForecast as DailyForecastType } from '@/types/weather';

interface DailyForecastProps {
  daily: DailyForecastType[];
  formatTemp: (temp: number) => string;
  getDayName: (timestamp: number) => string;
  getConditionKey: (weatherId: number) => string;
}

/**
 * Günlük Tahmin Bileşeni
 * 7 günlük tahmini liste halinde gösterir
 */
const DailyForecast: React.FC<DailyForecastProps> = ({
  daily,
  formatTemp,
  getDayName,
  getConditionKey
}) => {
  const { t } = useTranslation();

  // Sadece önümüzdeki 7 günü göster (bugün hariç)
  const next7Days = daily.slice(0, 7);

  // Bugün mü kontrol et
  const isToday = (timestamp: number): boolean => {
    const today = new Date();
    const date = new Date(timestamp * 1000);
    return today.toDateString() === date.toDateString();
  };

  // Yarın mı kontrol et
  const isTomorrow = (timestamp: number): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = new Date(timestamp * 1000);
    return tomorrow.toDateString() === date.toDateString();
  };

  // Gün adını formatla
  const formatDayName = (timestamp: number): string => {
    if (isToday(timestamp)) return t('forecast.today');
    if (isTomorrow(timestamp)) return t('forecast.tomorrow');
    
    const dayKey = getDayName(timestamp);
    return t(`forecast.${dayKey}`);
  };

  return (
    <div className="w-full">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          {t('forecast.daily')}
        </h2>
        <span className="text-sm text-white/50">7 {t('forecast.daily').toLowerCase().replace(' tahmin', '')}</span>
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {next7Days.map((day, index) => {
          const isFirstDay = index === 0;
          const weatherDesc = t(`conditions.${getConditionKey(day.weather[0]?.id)}`);

          return (
            <div
              key={day.dt}
              className={`
                group flex items-center gap-3 p-3 rounded-xl
                transition-all duration-300 cursor-pointer
                ${isFirstDay 
                  ? 'bg-white/20 border border-white/25' 
                  : 'glass-card hover:bg-white/15'
                }
              `}
            >
              {/* Gün Adı */}
              <div className="w-24 flex-shrink-0">
                <span className={`
                  text-sm font-medium
                  ${isFirstDay ? 'text-emerald-300' : 'text-white/80'}
                `}>
                  {formatDayName(day.dt)}
                </span>
              </div>

              {/* İkon ve Açıklama */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <WeatherIcon
                  iconCode={day.weather[0]?.icon}
                  weatherId={day.weather[0]?.id}
                  size="sm"
                  className="text-white/90 flex-shrink-0"
                  animated={false}
                />
                <span className="text-sm text-white/70 truncate hidden sm:block">
                  {weatherDesc}
                </span>
              </div>

              {/* Yağmur İhtimali */}
              {day.pop > 0.1 && (
                <div className="flex items-center gap-1 text-blue-300 flex-shrink-0">
                  <Droplets className="w-3 h-3" />
                  <span className="text-xs">
                    {Math.round(day.pop * 100)}%
                  </span>
                </div>
              )}

              {/* Rüzgar */}
              <div className="flex items-center gap-1 text-white/50 flex-shrink-0 w-14">
                <Wind className="w-3 h-3" />
                <span className="text-xs">
                  {Math.round(day.wind_speed)}
                </span>
              </div>

              {/* Sıcaklık Aralığı */}
              <div className="flex items-center gap-2 flex-shrink-0 w-24 justify-end">
                <span className="text-sm font-bold text-white">
                  {formatTemp(day.temp.max)}°
                </span>
                <span className="text-sm text-white/50">
                  {formatTemp(day.temp.min)}°
                </span>
              </div>

              {/* Ok İkonu */}
              <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
