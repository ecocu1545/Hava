import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud, Sun, Wind } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

/**
 * Yükleme Animasyonu Bileşeni
 * Hava durumu temalı yükleme animasyonu
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-6">
      {/* Animasyonlu İkonlar */}
      <div className="relative w-24 h-24">
        {/* Güneş */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-bounce">
          <Sun className="w-8 h-8 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        
        {/* Bulut */}
        <div className="absolute bottom-0 left-0 animate-pulse">
          <Cloud className="w-10 h-10 text-white/80" />
        </div>
        
        {/* Rüzgar */}
        <div className="absolute bottom-2 right-0">
          <Wind className="w-6 h-6 text-cyan-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Dairesel animasyon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 border-2 border-white/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
        </div>
      </div>

      {/* Mesaj */}
      <div className="text-center">
        <p className="text-white/80 text-lg font-medium animate-pulse">
          {message || t('app.loading')}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
