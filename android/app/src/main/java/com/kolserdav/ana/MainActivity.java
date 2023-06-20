package com.kolserdav.ana;

import android.Manifest;
import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Array;
import java.net.URLDecoder;
import java.util.Iterator;
import java.util.Locale;
import java.util.Set;


public class MainActivity extends Activity {
    private WebView mWebView;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_NO_TITLE);



        mWebView = new WebView(this);
        WebSettings webSettings = this.mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(false);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setDefaultTextEncodingName("utf-8");

        TTS tts = new TTS(this);
        mWebView.addJavascriptInterface(new AndroidTextToSpeech(tts), "androidTextToSpeech");
        mWebView.addJavascriptInterface(new AndroidCommon(this), "androidCommon");

        String url = "https://uyem.ru";
        Intent intent = getIntent();

        // Parse process text
        CharSequence text = intent
                .getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT);
        if (text != null) {
            // Dependency PROCESS_TEXT_QUERY_STRING in packages/app/utils/constants.ts
            url = url.concat("?process_text=");
            String _text = text.toString();
            try {
                _text = URLDecoder.decode(_text, "UTF-8");
            }
            catch (UnsupportedEncodingException e) {
                _text = text.toString();
                Log.e("Error decode URI", e.getMessage());
            }
            url = url.concat(_text);
        }

        // Parse deep link
        Uri path = intent.getData();
        if (path != null) {
            url = url.concat(path.getPath());
            url = url.concat("?");
            url = url.concat(path.getQuery());
        }

        mWebView.setWebChromeClient(new WebChromeClient() {

            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        request.grant(request.getResources());
                    }
                });

            }

        });

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

        });

        mWebView.loadUrl(url);

        this.setContentView(mWebView);

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            // Permission has not been granted, request permission
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, 1);
        } else {
            // Permission has already been granted
            // Setup audio recording
        }
    }

    public void setLocale(String languageCode) {
        Locale locale = new Locale(languageCode);
        Locale.setDefault(locale);
        Resources resources = this.getResources();
        Configuration config = resources.getConfiguration();
        config.setLocale(locale);
        resources.updateConfiguration(config, resources.getDisplayMetrics());
    }

    @Override
    public boolean onKeyDown(final int keyCode, final KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK) && mWebView.canGoBack()) {
            mWebView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}

class TTS {
    TextToSpeech textToSpeech;

    Locale[] locales;

    Voice voice = null;

    Locale lang;

    Set<Voice> voices;



    public TTS(MainActivity context) {
        textToSpeech = new TextToSpeech(context, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS) {
                    voices = textToSpeech.getVoices();
                    locales = Locale.getAvailableLocales();
                    voice = textToSpeech.getDefaultVoice();
                }
            }
        });
        textToSpeech.setLanguage(Locale.US);
    }


    public Boolean getSpeechState() {
        return textToSpeech.isSpeaking();
    }

    public String setAvailableLocales() {
        Locale[] _locales = textToSpeech.getAvailableLanguages().toArray(new Locale[0]);
        JSONObject json = new JSONObject();
        for (int i = 0; i < _locales.length; i ++) {
            Locale locale = _locales[i];
            try {
                json.put(String.valueOf(i), locale.getLanguage());
            } catch (Exception e) {
                Log.d("Error json put", e.getMessage());
            }
        }
        return json.toString();
    }

    public String getVoices(String lang) {
        JSONObject json = new JSONObject();
        Voice[] _voices = voices.toArray(new Voice[0]);
        for (int i = 0; i < _voices.length; i ++) {
            Voice v = _voices[i];
            try {
                if (v.getLocale().getLanguage().matches(lang)) {
                    json.put(String.valueOf(v.getName()), v.getLocale().getDisplayName());
                }
            } catch (Exception e) {
                Log.d("Error json voice put", e.getMessage());
            }
        }
        return json.toString();
    }
    public void textToSpeak(String text) {
        textToSpeech.setVoice(this.voice);
        textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null);
    }

    public void setVoice(String language) {
        Voice[] _voices = voices.toArray(new Voice[0]);
        for (int i = 0; i < _voices.length; i ++) {
            Voice v = _voices[i];
            boolean check = v.getName().equals(language);
            if (check) {
                this.voice = v;
            }
        }
    }

    public void stopSpeak() {
        textToSpeech.stop();
    }

    public String getLanguage() {
        return textToSpeech.getVoice().getLocale().getLanguage();
    }

    public void setLanguage(String locale) {
        Locale _locale = Locale.forLanguageTag(locale);
        lang = _locale;
        textToSpeech.setLanguage(_locale);
    }

    public void setSpeechRate(String val) {
        textToSpeech.setSpeechRate(Float.valueOf(val));
    }
}


class AndroidTextToSpeech {

    TTS tts;

    String voices;

    String locales;

    Boolean speaking = false;


    AndroidTextToSpeech(TTS tts) {
        this.tts = tts;
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
    AndroidCommon(MainActivity main) {
        this.main = main;
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
        new Handler(Looper.getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                main.setLocale(languageCode);
            }
        });
    }

}