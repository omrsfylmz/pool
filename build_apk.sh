#!/bin/bash

echo "🚀 Android APK derlemesi başlatılıyor..."

# Versiyon numarasını app.json'dan Node.js yardımıyla oku
# Node projesi olduğu için en güvenilir yöntem budur
if ! command -v node &> /dev/null; then
    echo "❌ Node.js komutu bulunamadı. Lütfen Node.js yüklü olduğundan emin olun."
    exit 1
fi

APP_VERSION=$(node -p "require('./app.json').expo.version")

if [ -z "$APP_VERSION" ] || [ "$APP_VERSION" == "undefined" ]; then
    echo "❌ app.json içinden versiyon alınamadı!"
    exit 1
fi

echo "🏷️  Versiyon numarası bulundu: $APP_VERSION"

# Android klasörüne geç
cd android || { echo "❌ android/ klasörü bulunamadı"; exit 1; }

# Projeyi temizle ve Release modunda derle
echo "🧹 Proje temizleniyor..."
./gradlew clean

echo "⚙️  APK oluşturuluyor..."
./gradlew assembleRelease

# Ana dizine geri dön
cd ..

# Dosya yollarını tanımla
APK_SOURCE="android/app/build/outputs/apk/release/app-release.apk"
DESKTOP_PATH="$HOME/Desktop"
DEST_FILE="$DESKTOP_PATH/foodpool-android-${APP_VERSION}.apk"

# Oluşturulan APK'yı Desktop'a kopyala
if [ -f "$APK_SOURCE" ]; then
    cp "$APK_SOURCE" "$DEST_FILE"
    echo "✅ Başarılı!"
    echo "📱 Uygulama masaüstünüze kopyalandı:"
    echo "👉 $DEST_FILE"
else
    echo "❌ Hata: İşlem bitti ama APK dosyası bulunamadı. Derleme sırasında bir hata oluşmuş olabilir."
fi
