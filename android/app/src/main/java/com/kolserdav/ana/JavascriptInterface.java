package com.kolserdav.ana;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;

import java.util.UUID;
import java.util.function.Function;

class AndroidTextToSpeech {

    TTS tts;

    String voices;

    String locales;

    Boolean speaking = false;

    Helper helper;


    AndroidTextToSpeech(TTS _tts) {
        tts = _tts;
        helper = new Helper();
    }

    @JavascriptInterface
    public void setAvailableLocales() {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                locales = tts.setAvailableLocales();
            }
        });
    }

    @JavascriptInterface
    public String getAvailableLocales() {
        return locales;
    }

    @JavascriptInterface
    public String getAvailableVoices() {
        return voices;
    }
    @JavascriptInterface
    public void speak(String text) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                speaking = true;
                tts.textToSpeak(text);
            }
        });
    }

    @JavascriptInterface
    public void setLanguage(String lang) {
        Log.d("Set language", lang);
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                tts.setLanguage(lang);
                voices = tts.getVoices(lang);
            }
        });
    }

    @JavascriptInterface
    public String getLanguage() {
        return tts.getLanguage();
    }

    @JavascriptInterface
    public void setVoice(String lang) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                tts.setVoice(lang);
            }
        });
    }

    @JavascriptInterface
    public void setSpeechRate(String rate) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                tts.setSpeechRate(rate);
            }
        });
    }

    @JavascriptInterface
    public boolean isSpeaking() {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                speaking = tts.getSpeechState();

            }
        });
        return speaking;
    }

    @JavascriptInterface
    public void cancel() {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                speaking = false;
                tts.stopSpeak();
            }
        });
    }



}

class AndroidCommon {

    MainActivity main;

    public String packageVersion;

    public final String notificationUnitId;

    private static final String TAG = "AndroidCommon";

    public boolean notificationEnabled = false;

    Helper helper;
    AndroidCommon(MainActivity _main) {
        main = _main;
        helper = new Helper();

        packageVersion = helper.getPackageVersion(main);
        Log.d(TAG, "Package version is: " + packageVersion);

        notificationUnitId = UUID.randomUUID().toString();
        Log.d(TAG, "Notification unit id is: " + notificationUnitId);
    }
    @JavascriptInterface
    public void closeApp() {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                main.finishAffinity();
            }
        });
    }

    @JavascriptInterface
    public String getPackageVersion() {
        return packageVersion;
    }

    @JavascriptInterface
    public void setNotificationEnabled(boolean value) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                notificationEnabled = value;
            }
        });
    }

    @JavascriptInterface
    public String getUUID() {
       return notificationUnitId;
    }

    @JavascriptInterface
    public void copyToClipboard(String text) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                ClipboardManager clipboard = (ClipboardManager) main.getSystemService(Context.CLIPBOARD_SERVICE);
                ClipData clip = ClipData.newPlainText("copy", text);
                clipboard.setPrimaryClip(clip);
            }
        });
    }

    @JavascriptInterface
    public void setKeepScreenOn(boolean sleep) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                if (sleep) {
                    main.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                } else {
                    main.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                }
            }
        });
    }

    @JavascriptInterface
    public void setInterfaceLanguage(String languageCode) {
        Resources resources = main.getResources();
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                helper.setLocale(resources, languageCode);
            }
        });
    }

    @JavascriptInterface
    public void getUrlDefault(final String cb) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {

                AppInterface schemaApp = main.db.app.init();
                Log.d(TAG, "Run callback " + cb + " (" + schemaApp.urlDefault + ", " + schemaApp.url + ")");
                main.mWebView.loadUrl("javascript:" + cb + "('" +
                        schemaApp.urlDefault + "', '" + schemaApp.url + "')");
            }
        });
    }

    @JavascriptInterface
    public void setUrl(String url) {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                AppInterface schemaApp = main.db.app.init();
                schemaApp.url = url;
                main.db.app.setUrl(schemaApp);
            }
        });
    }



}