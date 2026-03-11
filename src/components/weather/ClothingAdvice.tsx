import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ThermometerSnowflake, 
  Thermometer,
  Wind,
  CloudRain,
  Snowflake,
  Sun,
  Shirt
} from 'lucide-react';
import type { ClothingAdvice } from '@/types/weather';

interface ClothingAdviceProps {
  advice: ClothingAdvice | null;
}

/**
 * Giyinme Tavsiyesi Bileşeni
 * Hava durumuna göre giyinme önerisi sunar
 */
const ClothingAdviceCard: React.FC<ClothingAdviceProps> = ({ advice }) => {
  const { t } = useTranslation();

  if (!advice) return null;

  // Tavsiye konfigürasyonları
  const adviceConfig: Record<ClothingAdvice, {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
  }> = {
    veryCold: {
      icon: <ThermometerSnowflake className="w-6 h-6" />,
      color: 'text-cyan-300',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-400/30'
    },
    cold: {
      icon: <Thermometer className="w-6 h-6" />,
      color: 'text-blue-300',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30'
    },
    cool: {
      icon: <Wind className="w-6 h-6" />,
      color: 'text-teal-300',
      bgColor: 'bg-teal-500/20',
      borderColor: 'border-teal-400/30'
    },
    mild: {
      icon: <Shirt className="w-6 h-6" />,
      color: 'text-emerald-300',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-400/30'
    },
    warm: {
      icon: <Sun className="w-6 h-6" />,
      color: 'text-yellow-300',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30'
    },
    hot: {
      icon: <Sun className="w-6 h-6" />,
      color: 'text-orange-300',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-400/30'
    },
    veryHot: {
      icon: <Sun className="w-6 h-6" />,
      color: 'text-red-300',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400/30'
    },
    rain: {
      icon: <CloudRain className="w-6 h-6" />,
      color: 'text-blue-300',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30'
    },
    snow: {
      icon: <Snowflake className="w-6 h-6" />,
      color: 'text-indigo-300',
      bgColor: 'bg-indigo-500/20',
      borderColor: 'border-indigo-400/30'
    },
    wind: {
      icon: <Wind className="w-6 h-6" />,
      color: 'text-slate-300',
      bgColor: 'bg-slate-500/20',
      borderColor: 'border-slate-400/30'
    }
  };

  const config = adviceConfig[advice];

  return (
    <div className={`
      w-full p-4 rounded-xl
      ${config.bgColor} ${config.borderColor}
      border backdrop-blur-md
      transition-all duration-300
    `}>
      <div className="flex items-start gap-4">
        {/* İkon */}
        <div className={`
          p-3 rounded-xl
          ${config.bgColor}
          ${config.color}
        `}>
          {config.icon}
        </div>

        {/* İçerik */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white/80 mb-1">
            {t('clothing.title')}
          </h3>
          <p className={`text-base font-medium ${config.color}`}>
            {t(`clothing.${advice}`)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClothingAdviceCard;
