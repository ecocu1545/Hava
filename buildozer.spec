[app]

# (str) Uygulamanın başlığı
title = Hava Praqnozu

# (str) Paket adı (boşluk ve özel karakter olmasın)
package.name = havadurumu

# (str) Paket domaini
package.domain = org.test

# (str) Kaynak kodun olduğu yer (Burası kritik! dist klasörünü hedefliyoruz)
source.dir = ./dist

# (list) Dahil edilecek dosya uzantıları
source.include_exts = html,js,css,png,jpg,svg,json

# (str) Uygulama versiyonu
version = 0.1

# (list) Gereksinimler (Web projesi olsa da Buildozer için bunlar temeldir)
requirements = python3,kivy,android

# (str) Ekran yönü (Dikey için portrait, Yatay için landscape)
orientation = portrait

# (bool) Tam ekran modu
fullscreen = 1

# (list) Android izinleri (Hava durumu için konum gerekebilir)
android.permissions = INTERNET, ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION

# (int) Android API seviyesi (Genelde 33 veya 34 idealdir)
android.api = 33

# (int) Minimum Android versiyonu
android.minapi = 21

# (str) Android NDK versiyonu (Otomatik seçilmesi için boş bırakılabilir)
# android.ndk = 25b

# (bool) Logcat'i kopyala (Hata ayıklama için)
android.logcat_filters = *:S python:D

[buildozer]
# (int) Log seviyesi (2 en detaylısıdır)
log_level = 2

# (int) Hata durumunda durma
warn_on_root = 1

