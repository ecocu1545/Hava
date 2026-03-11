import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Hata Gösterim Bileşeni
 * Hata durumlarını kullanıcıya gösterir
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-6 p-6">
      {/* Hata İkonu */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        {/* Pulse efekti */}
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-red-500/10 animate-ping" />
      </div>

      {/* Hata Mesajı */}
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-white mb-2">
          {t('app.error')}
        </h3>
        <p className="text-white/60">
          {message || t('location.unavailable')}
        </p>
      </div>

      {/* Tekrar Dene Butonu */}
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-white/20 hover:bg-white/30 text-white border border-white/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {t('app.retry')}
        </Button>
      )}
    </div>
  );
};

export default ErrorDisplay;
