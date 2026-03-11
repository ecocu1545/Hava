import React from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Wind } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { HourlyForecast as HourlyForecastType } from '@/types/weather';

interface HourlyForecastProps {
  hourly: HourlyForecastType[];
  formatTemp: (temp: number) => string;
  formatTime: (timestamp: number) => string;
}

/**
 * Saatlik Tahmin Bileşeni
 * Yatay kaydırılabilir 24 saatlik tahmin
 */
const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  formatTemp,
  formatTime
}) => {
  const { t } = useTranslation();

  // Sadece önümüzdeki 24 saati göster
  const next24Hours = hourly.slice(0, 24);

  return (
    <div className="w-full">
      {/* Başlık */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          {t('forecast.hourly')}
        </h2>
        <span className="text-sm text-white/50">
          24 {t('forecast.hourly').toLowerCase().replace(' tahmin', '')}
        </span>
      </div>

      {/* Yatay Kaydırma Alanı */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 pb-4">
          {next24Hours.map((hour, index) => {
            const isNow = index === 0;

            return (
              <div
                key={hour.dt}
                className={`
                  flex-shrink-0 w-20 p-3 rounded-xl
                  flex flex-col items-center gap-2
                  transition-all duration-300
                  ${isNow 
                    ? 'bg-white/25 border border-white/30 shadow-lg' 
                    : 'glass-card hover:bg-white/15'
                  }
                `}
              >
                {/* Saat */}
                <span className={`
                  text-xs font-medium
                  ${isNow ? 'text-emerald-300' : 'text-white/70'}
                `}>
                  {isNow ? t('forecast.today') : formatTime(hour.dt)}
                </span>

                {/* İkon */}
                <WeatherIcon
                  iconCode={hour.weather[0]?.icon}
                  weatherId={hour.weather[0]?.id}
                  size="md"
                  className="text-white/90"
                  animated={false}
                />

                {/* Sıcaklık */}
                <span className="text-lg font-bold text-white">
                  {formatTemp(hour.temp)}°
                </span>

                {/* Yağmur İhtimali */}
                {hour.pop > 0 && (
                  <div className="flex items-center gap-1 text-blue-300">
                    <Droplets className="w-3 h-3" />
                    <span className="text-xs">
                      {Math.round(hour.pop * 100)}%
                    </span>
                  </div>
                )}

                {/* Rüzgar */}
                <div className="flex items-center gap-1 text-white/50">
                  <Wind className="w-3 h-3" />
                  <span className="text-xs">
                    {Math.round(hour.wind_speed)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="bg-white/10" />
      </ScrollArea>
    </div>
  );
};

export default HourlyForecast;
