import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CityInfo } from '@/types/weather';

interface CitySearchProps {
  searchResults: CityInfo[];
  searching: boolean;
  onSearch: (query: string) => void;
  onSelect: (city: CityInfo) => void;
  onClose: () => void;
}

/**
 * Şehir Arama Bileşeni
 * Şehir arama ve seçim işlemlerini yönetir
 */
const CitySearch: React.FC<CitySearchProps> = ({
  searchResults,
  searching,
  onSearch,
  onSelect,
  onClose
}) => {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Input'a odaklan
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Dışarı tıklamayı dinle
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Arama işlemi
  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      onSearch(value);
    }
  }, [onSearch]);

  // Şehir seç
  const handleSelect = (city: CityInfo) => {
    onSelect(city);
    setQuery('');
    setIsOpen(false);
    onClose();
  };

  // Aç/Kapat
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setQuery('');
      onClose();
    }
  };

  // Şehir adını diline göre getir
  const getCityDisplayName = (city: CityInfo): string => {
    const lang = i18n.language;
    if (city.local_names && city.local_names[lang]) {
      return city.local_names[lang];
    }
    return city.name;
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleOpen}
        className="glass-button text-white hover:bg-white/20 transition-all duration-300"
      >
        <Search className="w-4 h-4 mr-2" />
        <span className="text-sm">{t('location.search')}</span>
      </Button>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Arama Input */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('location.searchPlaceholder')}
            className="glass-input pl-10 pr-10 text-white placeholder:text-white/50"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleOpen}
          className="glass-button text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Sonuçlar */}
      {query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
          {searching ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-5 h-5 text-white/60 animate-spin" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="divide-y divide-white/10">
              {searchResults.map((city, index) => (
                <button
                  key={`${city.lat}-${city.lon}-${index}`}
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-colors text-left"
                >
                  <MapPin className="w-4 h-4 text-white/50 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {getCityDisplayName(city)}
                    </p>
                    <p className="text-white/50 text-sm">
                      {city.country}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-white/50">
              {t('location.unavailable')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
