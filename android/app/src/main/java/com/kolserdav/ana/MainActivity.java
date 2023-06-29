package com.kolserdav.ana;

import android.app.Activity;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.net.ConnectivityManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Window;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class MainActivity extends Activity {

    MainActivity context = this;
    private static final String TAG = "MainActivity";

    public WebView mWebView;

    public DB db;

    private Helper helper;

    private Boolean firstLoad = true;


    private static class Request extends AsyncTask<Void, Void, String> {

        public int status = 500;

        private DB db;

        Request(DB _db) {
            db = _db;
        }

        public static final String TAG = "Request";

        protected String doInBackground(Void... params) {
            AppInterface dataApp = db.app.init(new AppInterface());
            try {
                if (dataApp.url.equals("null")) {
                    return "Error";
                }

                String useUrl = dataApp.url + Config.CHECK_URL_PATH;
                Log.d(TAG, "Try request " + useUrl);
                URL url = new URL(useUrl);

                HttpURLConnection connection = (HttpURLConnection) url.openConnection();

                connection.setRequestMethod("GET");

                status = connection.getResponseCode();

                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                return response.toString();
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        protected void onGetStatus(Integer code) {
            Log.d(TAG, "Code is " + code);
        }

        protected void onPostExecute(String response) {
            if (response != null) {
                Log.d(MainActivity.TAG, "Status " + this.status);

                onGetStatus(status);
            }

        }
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().requestFeature(Window.FEATURE_NO_TITLE);

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
        setContentView(mWebView);


        db = new DB(this) {

            @Override
            public void onCreate(SQLiteDatabase _sqLiteDatabase) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Log.e(TAG, e.getMessage() + e.getCause());
                }
                if (app == null) {
                    Log.w(TAG, "App is null");
                    return;
                }

                AppInterface schemaApp = app.init(new AppInterface());
                Log.d(TAG, "On create DB " + schemaApp);

                Intent intent = getIntent();
                String url = helper.listenProcessText(intent, schemaApp);


                String data = null;
                try {
                    try {
                       new Request(this) {
                           @Override
                           protected void onGetStatus(Integer code) {
                               super.onGetStatus(code);
                               context.runOnUiThread(new Runnable() {
                                   @Override
                                   public void run() {
                                       AppInterface schemaApp = db.app.init(new AppInterface());
                                           String _url = url;
                                       if (status != 200) {
                                           Log.w(TAG, "Url replaced " + _url);
                                           _url = _url.replace(_url, schemaApp.urlDefault);
                                       }
                                       if (_url.equals("null")) {
                                           _url = schemaApp.urlDefault;
                                       }

                                       Log.d(TAG,"Status is " + status + ", load url " + _url);
                                       context.mWebView.loadUrl(_url);
                                       Log.d(TAG,"Loaded url " + _url);

                                       context.helper.microphoneAccess();
                                   }
                               });
                           }
                       }.execute().get();

                    } catch (ExecutionException e) {
                        Log.e(TAG, "Error request E " + e.getMessage());
                    }
                } catch (InterruptedException e) {
                    Log.e(TAG, "Error request I " + e.getMessage());
                }
                Log.d(TAG, "Data is " + data);
            }
        };

        webViewListeners();

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
                AppInterface schema = context.db.app.init(new AppInterface());
                String url = _url;

                Log.d(TAG, "Should override url " + url +
                        " with saved " + schema.path);

                String __url = schema.url;
                if (__url.equals("null")) {
                    __url = schema.urlDefault;
                }
                Pattern pattern = Pattern.compile(__url, Pattern.CASE_INSENSITIVE);
                Matcher matcher = pattern.matcher(url);
                boolean matchFound = matcher.find();


                if (matchFound && !schema.path.equals("/")) {
                    url = url.replaceAll("\\/[a-z]+$", "") + schema.path;
                }
                Log.d(TAG, "Replaced url " + url);
                view.loadUrl(url);

                if (firstLoad) {
                    Thread task = new Thread() {
                        public void run() {
                            try {
                                Thread.sleep(helper.FIRST_LOAD_DURATION);
                                Log.d(TAG, "First load is " + firstLoad);
                                firstLoad = false;
                            } catch(InterruptedException v) {
                                Log.e(TAG, v.toString());
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

                AppInterface schemaApp = context.db.app.init(new AppInterface());
                if (!firstLoad) {
                    new AppInterface(schemaApp.id,
                            schemaApp.url,
                            schemaApp.urlDefault, schemaApp.path);
                    String _url = schemaApp.url;
                    if (_url.equals("null")) {
                        _url = schemaApp.urlDefault;
                    }
                    String path = url.replace(_url, "");
                    schemaApp.path = path+"";
                    context.db.app.setPath(schemaApp);
                    Log.d(TAG, "Change path  from " + schemaApp.path + " to " + path +
                            ", url: " + schemaApp.url + ", _url: " + _url);
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



