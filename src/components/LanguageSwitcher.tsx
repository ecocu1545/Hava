import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { supportedLanguages, changeLanguage } from '@/i18n';

/**
 * Dil Değiştirici Bileşeni
 * Sağ üst köşede dil seçimi için dropdown menü
 */
const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  /**
   * Dil değiştir
   */
  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="glass-button text-white hover:bg-white/20 transition-all duration-300"
        >
          <Globe className="w-4 h-4 mr-2" />
          <span className="uppercase font-medium">
            {t(`language.${currentLanguage}`) || currentLanguage}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="glass-panel border-white/20 min-w-[140px]"
      >
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              cursor-pointer flex items-center justify-between
              hover:bg-white/20 transition-colors duration-200
              ${currentLanguage === lang.code ? 'bg-white/10' : ''}
            `}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium text-white/90">
                {lang.name}
              </span>
            </div>
            {currentLanguage === lang.code && (
              <Check className="w-4 h-4 text-emerald-400" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
