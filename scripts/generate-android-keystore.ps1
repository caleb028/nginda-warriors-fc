# Nginda Warriors FC — Android Release Keystore Generator (PowerShell)
param(
    [string]$KeystorePath = "apps/public-website/android/app/nginda-release.keystore",
    [string]$Alias = "ngindawarriors",
    [string]$StorePass = "NgindaWarriors2024Release!",
    [string]$KeyPass = "NgindaWarriors2024Release!"
)

Write-Host "============================================================" -ForegroundColor Green
Write-Host "NGINDA WARRIORS FC — ANDROID PRODUCTION KEYSTORE GENERATOR" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Green

if (Test-Path $KeystorePath) {
    Write-Host "Keystore already exists at: $KeystorePath" -ForegroundColor Yellow
    exit 0
}

$dname = "CN=Nginda Warriors FC, OU=Club Digital Infrastructure, O=Nginda Warriors FC, L=Murang'a, ST=Murang'a County, C=KE"

keytool -genkey -v `
    -keystore $KeystorePath `
    -alias $Alias `
    -keyalg RSA `
    -keysize 2048 `
    -validity 10000 `
    -storepass $StorePass `
    -keypass $KeyPass `
    -dname $dname

if ($LASTEXITCODE -eq 0) {
    Write-Host "Success! Protected release keystore generated at $KeystorePath" -ForegroundColor Green
} else {
    Write-Host "Notice: keytool not found in current PATH. Use Java JDK keytool or GitHub Actions CI to generate." -ForegroundColor Yellow
}
