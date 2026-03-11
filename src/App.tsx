import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

// Hooks
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';

// Components
import LanguageSwitcher from '@/components/LanguageSwitcher';
import HeroSection from '@/components/weather/HeroSection';
import HourlyForecast from '@/components/weather/HourlyForecast';
import DailyForecast from '@/components/weather/DailyForecast';
import ClothingAdviceCard from '@/components/weather/ClothingAdvice';
import CitySearch from '@/components/weather/CitySearch';
import LoadingSpinner from '@/components/weather/LoadingSpinner';
import ErrorDisplay from '@/components/weather/ErrorDisplay';

// Styles
import './App.css';

/**
 * Ana Uygulama Bileşeni
 * Tüm hava durumu uygulamasını bir araya getirir
 */
function App() {
  const { t } = useTranslation();
  
  // Konum hook'u
  const { 
    coords, 
    loading: locationLoading, 
    error: locationError,
    getLocation 
  } = useLocation();

  // Hava durumu hook'u
  const {
    data: weatherData,
    city,
    loading: weatherLoading,
    error: weatherError,
    searchResults,
    searching,
    searchCities,
    selectCity,
    getClothingAdvice,
    getThemeColors,
    getDayName,
    formatTime,
    formatTemp
  } = useWeather(coords);

  // Hava durumu koşul anahtarını getir
  const getConditionKey = useCallback((weatherId: number): string => {
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 400) return 'drizzle';
    if (weatherId >= 500 && weatherId < 600) return weatherId < 505 ? 'lightRain' : 'heavyRain';
    if (weatherId >= 600 && weatherId < 700) return weatherId < 605 ? 'lightSnow' : 'heavySnow';
    if (weatherId >= 700 && weatherId < 800) return 'fog';
    if (weatherId === 800) return 'clear';
    if (weatherId === 801) return 'partlyCloudy';
    if (weatherId === 802) return 'cloudy';
    if (weatherId >= 803) return 'mostlyCloudy';
    return 'clear';
  }, []);

  // Tema renklerini al
  const themeColors = getThemeColors();

  // Yükleme durumu
  const isLoading = locationLoading || weatherLoading;
  
  // Hata durumu
  const hasError = locationError || weatherError;

  return (
    <div className={`
      min-h-screen w-full
      bg-gradient-to-br ${themeColors.from} ${themeColors.via} ${themeColors.to}
      transition-all duration-1000 ease-in-out
    `}>
      {/* Arka Plan Deseni */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')]" />
      </div>

      {/* Ana İçerik */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full p-4 md:p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="w-6 h-6 text-white"
                >
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white hidden sm:block">
                {t('app.title')}
              </h1>
            </div>

            {/* Sağ Taraf - Arama ve Dil */}
            <div className="flex items-center gap-2">
              <CitySearch
                searchResults={searchResults}
                searching={searching}
                onSearch={searchCities}
                onSelect={selectCity}
                onClose={() => {}}
              />
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* Ana İçerik */}
        <main className="flex-1 px-4 md:px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              // Yükleme Durumu
              <LoadingSpinner message={t('location.getting')} />
            ) : hasError && !weatherData ? (
              // Hata Durumu
              <ErrorDisplay 
                message={locationError || weatherError || undefined}
                onRetry={getLocation}
              />
            ) : weatherData ? (
              // Hava Durumu İçeriği
              <div className="space-y-6">
                {/* Hero Bölümü */}
                <section className="glass-panel rounded-2xl p-6 md:p-8">
                  <HeroSection
                    weather={weatherData}
                    city={city}
                    formatTemp={formatTemp}
                    formatTime={formatTime}
                    getConditionKey={getConditionKey}
                  />
                </section>

                {/* Saatlik Tahmin */}
                <section className="glass-panel rounded-2xl p-6">
                  <HourlyForecast
                    hourly={weatherData.hourly}
                    formatTemp={formatTemp}
                    formatTime={formatTime}
                  />
                </section>

                {/* Günlük Tahmin */}
                <section className="glass-panel rounded-2xl p-6">
                  <DailyForecast
                    daily={weatherData.daily}
                    formatTemp={formatTemp}
                    getDayName={getDayName}
                    getConditionKey={getConditionKey}
                  />
                </section>

                {/* Giyinme Tavsiyesi */}
                <section>
                  <ClothingAdviceCard advice={getClothingAdvice()} />
                </section>
              </div>
            ) : null}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full p-4 text-center">
          <p className="text-white/40 text-sm">
            {t('app.title')} © {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
