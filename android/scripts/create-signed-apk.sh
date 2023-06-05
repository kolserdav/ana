./gradlew assembleRelease
jarsigner -keystore ~/.keystore/clientkeystore  app/build/outputs/apk/release/app-release-unsigned.apk  key0
zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk app/release/app-release.apk
mkdir -p app/release