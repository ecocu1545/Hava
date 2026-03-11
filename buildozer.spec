[app]
title = Hava Praqnozu
package.name = havapraqnozu
package.domain = org.hava
source.dir = .
source.include_exts = py,png,jpg,kv,atlas,html,js,css,json
version = 0.1
requirements = python3,kivy,android

# Uygulama simgesi ve yönü
orientation = portrait
fullscreen = 1

# Android izinleri ve ayarları
android.permissions = INTERNET, ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION
android.api = 33
android.minapi = 21
android.sdk = 33
android.ndk = 25b
android.accept_sdk_license = True
android.archs = arm64-v8a, armeabi-v7a

# Log ayarları
android.logcat_filters = *:S python:D

[buildozer]
log_level = 2
warn_on_root = 1
