import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Moon,
  CloudSun
} from 'lucide-react';

interface WeatherIconProps {
  iconCode: string;
  weatherId: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

/**
 * Hava Durumu İkon Bileşeni
 * OpenWeatherMap ikon kodlarını Lucide ikonlarına dönüştürür
 */
const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  iconCode, 
  weatherId,
  size = 'md',
  className = '',
  animated = true
}) => {
  // Boyut sınıfları
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  // Gece mi kontrol et
  const isNight = iconCode?.endsWith('n');

  /**
   * Hava durumu ID'sine göre ikon seç
   */
  const getIcon = () => {
    // Gece ve açık hava -> Ay
    if (isNight && weatherId === 800) {
      return <Moon className={`${sizeClasses[size]} ${className}`} />;
    }

    // Hava durumu ID'sine göre ikon
    if (weatherId >= 200 && weatherId < 300) {
      // Fırtına
      return <CloudLightning className={`${sizeClasses[size]} ${className}`} />;
    }
    
    if (weatherId >= 300 && weatherId < 400) {
      // Çisenti
      return <CloudDrizzle className={`${sizeClasses[size]} ${className}`} />;
    }
    
    if (weatherId >= 500 && weatherId < 600) {
      // Yağmur
      return <CloudRain className={`${sizeClasses[size]} ${className}`} />;
    }
    
    if (weatherId >= 600 && weatherId < 700) {
      // Kar
      return <CloudSnow className={`${sizeClasses[size]} ${className}`} />;
    }
    
    if (weatherId >= 700 && weatherId < 800) {
      // Sis/Duman
      return <CloudFog className={`${sizeClasses[size]} ${className}`} />;
    }
    
    if (weatherId === 800) {
      // Açık
      return <Sun className={`${sizeClasses[size]} ${className}`} />;
    }
    
    if (weatherId === 801 || weatherId === 802) {
      // Parçalı bulutlu
      return <CloudSun className={`${sizeClasses[size]} ${className}`} />;
    }
    
    if (weatherId >= 803) {
      // Bulutlu
      return <Cloud className={`${sizeClasses[size]} ${className}`} />;
    }

    // Varsayılan
    return <Sun className={`${sizeClasses[size]} ${className}`} />;
  };

  // Animasyon sınıfları
  const animationClass = animated ? 'weather-icon-animated' : '';

  return (
    <div className={`inline-flex items-center justify-center ${animationClass}`}>
      {getIcon()}
    </div>
  );
};

export default WeatherIcon;
