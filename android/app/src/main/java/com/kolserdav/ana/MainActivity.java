package com.kolserdav.ana;

import android.app.Activity;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Window;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class MainActivity extends Activity {
    private WebView mWebView;

    private DB db;

    private Helper helper;

    private Boolean firstLoad = true;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().requestFeature(Window.FEATURE_NO_TITLE);

        db = new DB(this);

        helper = new Helper(this, this);


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


        webViewListeners();

        Intent intent = getIntent();
        String url =  helper.listenProcessText(intent, db.app.schema);
        mWebView.loadUrl(url);

        this.setContentView(mWebView);

        helper.microphoneAccess();
    }


    private void webViewListeners() {
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
            public boolean shouldOverrideUrlLoading(WebView view, String _url) {
                String url = _url;

                Log.d("INFO", "Should override url " + url +
                        " with saved " + db.app.schema.path);

                Pattern pattern = Pattern.compile(db.app.schema.url, Pattern.CASE_INSENSITIVE);
                Matcher matcher = pattern.matcher(url);
                boolean matchFound = matcher.find();

                if (url != db.app.schema.url + db.app.schema.path && matchFound) {
                    url = db.app.schema.url + db.app.schema.path;
                }
                view.loadUrl(url);

                if (firstLoad) {
                    Thread task = new Thread() {
                        public void run() {
                            try {
                                Thread.sleep(3000);
                                Log.d("INFO", "First load is " + firstLoad);
                                firstLoad = false;
                            } catch(InterruptedException v) {
                                Log.e("ERROR", v.toString());
                            }
                        }
                    };
                    task.start();
                }
                return true;
            }

            @Override
            public void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
                super.doUpdateVisitedHistory(view, url, isReload);

                if (!firstLoad) {
                    AppInterface _app = new AppInterface(db.app.schema.id, db.app.schema.url, db.app.schema.path);
                    _app.path = url.replace(_app.url, "");
                    db.app.setPath(_app);
                    Log.d("PATH", "Change path  from " + _app.path + " to " + db.app.schema.path);
                }
            }
        });
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



