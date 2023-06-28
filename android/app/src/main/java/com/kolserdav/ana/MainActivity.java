package com.kolserdav.ana;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Window;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Locale;

public class MainActivity extends Activity {
    private WebView mWebView;

    private DB db;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_NO_TITLE);

        db = new DB(this);


        mWebView = new WebView(this);
        WebSettings webSettings = this.mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(false);

        ConnectivityManager cm = (ConnectivityManager) this.getSystemService(Activity.CONNECTIVITY_SERVICE);
        if(cm != null && cm.getActiveNetworkInfo() != null && cm.getActiveNetworkInfo().isConnected()){
            webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        }
        else{
            webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        }

        webSettings.setDefaultTextEncodingName("utf-8");

        TTS tts = new TTS(this);
        mWebView.addJavascriptInterface(new AndroidTextToSpeech(tts), "androidTextToSpeech");
        mWebView.addJavascriptInterface(new AndroidCommon(this), "androidCommon");




        String url = db.app.schema.url;
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
        Log.d("PATH", db.app.schema.path);
        // Parse deep link
        Uri path = intent.getData();
        if (path != null) {
            url = url.concat(path.getPath());
            url = url.concat("?");
            url = url.concat(path.getQuery());
        } else {
            url.concat(db.app.schema.path);
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
                Log.d("PATH", "Change path " + url);
                AppInterface _app = new AppInterface(db.app.schema.id, db.app.schema.url, db.app.schema.path);
                _app.path = url.replace(_app.url, "");
                db.app.setPath(_app);
                view.loadUrl(url);


                return true;
            }

        });

        mWebView.loadUrl(url);

        this.setContentView(mWebView);

        microphoneAccess();
    }

    private void microphoneAccess() {
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



