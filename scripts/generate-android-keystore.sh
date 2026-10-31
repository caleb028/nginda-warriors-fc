#!/usr/bin/env bash
# Nginda Warriors FC — Android Release Keystore Generator (Bash)
set -e

KEYSTORE_PATH="${1:-apps/public-website/android/app/nginda-release.keystore}"
ALIAS="${2:-ngindawarriors}"
STOREPASS="${3:-NgindaWarriors2024Release!}"
KEYPASS="${4:-NgindaWarriors2024Release!}"
DNAME="CN=Nginda Warriors FC, OU=Club Digital Infrastructure, O=Nginda Warriors FC, L=Murang'a, ST=Murang'a County, C=KE"

echo "============================================================"
echo "NGINDA WARRIORS FC — ANDROID PRODUCTION KEYSTORE GENERATOR"
echo "============================================================"

if [ -f "$KEYSTORE_PATH" ]; then
    echo "Keystore already exists at: $KEYSTORE_PATH"
    exit 0
fi

keytool -genkey -v \
    -keystore "$KEYSTORE_PATH" \
    -alias "$ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$STOREPASS" \
    -keypass "$KEYPASS" \
    -dname "$DNAME"

echo "Success! Protected release keystore generated at $KEYSTORE_PATH"
