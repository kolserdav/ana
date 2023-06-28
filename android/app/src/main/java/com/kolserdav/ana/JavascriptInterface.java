package com.kolserdav.ana;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.res.Resources;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;

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

    Helper helper;
    AndroidCommon(MainActivity _main) {
        main = _main;
        helper = new Helper();
    }
    @JavascriptInterface
    public void closeApp() {
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                main.finishAffinity();
                System.exit(0);
            }
        });
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

}