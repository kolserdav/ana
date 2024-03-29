package com.kolserdav.ana;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.PermissionRequest;
import android.webkit.SslErrorHandler;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;

import org.json.JSONException;
import org.json.JSONObject;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class MainActivity extends Activity {

    MainActivity context = this;

    TTS tts;
    private static final String TAG = "MainActivity";

    public WebView mWebView;

    public DB db;

    private Helper helper;

    private Intent serviceIntent;

    private WebSettings webSettings;

    public Boolean notStopWeb = Config.NOT_STOP_WEB_DEFAULT;

    AndroidCommon androidCommon;


    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);

        Log.d(TAG, "On new intent");
        setIntent(intent);
        String url = db.getUrl();
        Uri data = intent.getData();
        if (data != null) {
            mWebView.loadUrl(url + data.getPath() + "?" + data.getQuery());
        } else {
            String _url = helper.listenProcessText(intent, db.app.init());
            mWebView.loadUrl(_url);
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        Log.d(TAG, "On stop");
        if (androidCommon.notificationEnabled) {
            createNotificationChannel();
            startService(serviceIntent);
        } else {
            Log.d(TAG, "Notification service disabled");
        }
        closeApp();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = getString(R.string.channel_name);
            String description = getString(R.string.channel_description);
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(Config.CHANNEL_ID, name, importance);
            channel.setDescription(description);
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(TAG, "On create");

        getWindow().requestFeature(Window.FEATURE_NO_TITLE);
        tts = new TTS(this);
        helper = new Helper(this, this);
        androidCommon =  new AndroidCommon(this);


        mWebView = new WebView(this);

        webSettings = this.mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(false);



        setCacheMode();

        webSettings.setDefaultTextEncodingName("utf-8");


        mWebView.addJavascriptInterface(new AndroidTextToSpeech(tts), "androidTextToSpeech");
        mWebView.addJavascriptInterface(androidCommon, "androidCommon");
        setContentView(mWebView);

        serviceIntent = new Intent(this, DisplayNotification.class);

        if (Config.screenOn) {
            Log.w(TAG, "Use development screen on");
            setScreenOn();
        }

        db = new DB(this) {


            @SuppressLint("StaticFieldLeak")
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

                AppInterface schemaApp = app.init();

                Intent intent = getIntent();
                String url = helper.listenProcessText(intent, schemaApp);


                try {
                    try {
                        String _url = schemaApp.url;
                        if (_url.equals("null")) {
                            _url = schemaApp.urlDefault;
                        }
                        String useUrl = _url + Config.CHECK_URL_PATH;
                       new Request(useUrl) {
                           @Override
                           protected void onGetStatus(Integer code) {
                               super.onGetStatus(code);
                               context.runOnUiThread(new Runnable() {
                                   @Override
                                   public void run() {
                                       String _url = url;
                                       Log.d(TAG, "Application status: " + status);
                                       if (status != 200) {
                                           Log.w(TAG, "Url replaced " + _url);
                                           _url = _url.replace(_url, schemaApp.urlDefault);
                                           schemaApp.url = "null";
                                           db.app.setUrl(schemaApp);
                                       }
                                       if (_url.equals("null")) {
                                           _url = schemaApp.urlDefault;
                                       }

                                       openScreenDev();
                                       Log.d(TAG,"Status is " + status + ", load url " + _url);
                                       context.mWebView.loadUrl(_url);
                                       Log.d(TAG,"Loaded url " + _url);

                                       context.helper.microphoneAccess();
                                   }
                               });
                           }

                           @Override
                           protected void onPostExecute(String response) {
                               super.onPostExecute(response);
                               Log.d(TAG, "On post execute: " + response);
                               JSONObject data = null;
                               if (response == null) {
                                   return;
                               }
                               try {
                                   data = new JSONObject(response);
                               } catch (JSONException e) {
                                   Log.e(TAG, "Failed parse JSON: " + e.getMessage());
                               }
                               if (data != null) {
                                   Object wsAddress = null;
                                   try {
                                       wsAddress = data.get("data");
                                   } catch (JSONException e) {
                                       Log.e(TAG, "Failed get WS address from JSON: " + e.getMessage());
                                   }
                                   Log.d(TAG, "WS server is: " + wsAddress);
                                   if (wsAddress != null) {
                                       AppInterface app = db.app.init();
                                       app.wsAddress = wsAddress.toString();
                                       db.app.setWSAddress(app);

                                       // Prepare notification service for next start when app is going to stop
                                       serviceIntent.putExtra(DisplayNotification.INTENT_EXTRA_NAME_URL, db.getUrl());
                                       serviceIntent.putExtra(DisplayNotification.INTENT_EXTRA_NAME_WS_ADDRESS, app.wsAddress);
                                       serviceIntent.putExtra(DisplayNotification.INTENT_EXTRA_NAME_NOTIFICATION_UNIT_ID, androidCommon.notificationUnitId);

                                       // Stopping notification service while run app
                                       stopService(serviceIntent);
                                   }
                               }
                           }
                       }.execute().get();

                    } catch (ExecutionException e) {
                        Log.e(TAG, "Failed request E " + e.getMessage());
                    }
                } catch (InterruptedException e) {
                    Log.e(TAG, "Failed request I " + e.getMessage());
                }
            }
        };

        webViewListeners();
    }

    private void openScreenDev() {
        /**
            if (isDevMode()) {
                getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            }
        */
    }

    private boolean setScreenOn() {
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return Settings.Secure.getInt(context.getContentResolver(), Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0) != 0;
        } else {
            return Settings.Secure.getInt(context.getContentResolver(), Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 1) != 0;
        }
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
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                handler.proceed();
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String _url) {
                String url = _url;

                boolean isImage = helper.handleRegex(url, Config.dataImageReg);
                if (isImage) {
                    return true;
                }

                AppInterface schema = context.db.app.init();

                Log.d(TAG, "Should override url " + url +
                        " with saved " + schema.path);

                String __url = schema.url;
                if (__url.equals("null")) {
                    __url = schema.urlDefault;
                }

                Intent intent = getIntent();

                boolean matchFound = helper.handleRegex(url, __url);
                // Open other url
                if (!matchFound) {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(i);
                    return true;
                }

                Log.d(TAG, "Schema path: " + schema.path);

                // Rewrite url to saved
                if (!schema.path.equals("/") &&
                        !Intent.ACTION_PROCESS_TEXT.equals(intent.getAction())) {
                    url = url.replaceAll(Config.pathRegex, "") + schema.path;
                }

                Log.d(TAG, "Replaced url " + url);
                view.loadUrl(url);

                return false;
            }

            @Override
            public void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
                super.doUpdateVisitedHistory(view, url, isReload);

                AppInterface schemaApp = context.db.app.init();

                String _url = schemaApp.url;
                if (_url.equals("null")) {
                    _url = schemaApp.urlDefault;
                }
                Log.d(TAG, "Do updateVisitedHistory url: " + url + ", _url: " + _url);
                Pattern pattern =  Pattern.compile(Config.originRegex);
                Matcher matcher = pattern.matcher(url);
                String path = matcher.replaceAll("");
                schemaApp.path = path+"";
                context.db.app.setPath(schemaApp);
                Log.d(TAG, "Change path  from " + schemaApp.path + " to " + path +
                        ", url: " + schemaApp.url + ", _url: " + _url);

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

    public void closeApp() {
        Log.d(TAG, "Close app with notStopWeb: " + notStopWeb);
        finishAffinity();
        finish();
        if (!notStopWeb) {
            destroyWebView();
        }
    }

    public void destroyWebView() {

        if (mWebView == null) {
            return;
        }

        mWebView.clearHistory();

        mWebView.clearCache(true);

        mWebView.loadUrl("about:blank");

        mWebView.onPause();
        mWebView.removeAllViews();
        mWebView.destroyDrawingCache();

        mWebView.pauseTimers();

        mWebView.destroy();

        mWebView = null;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        tts.shutdown();
    }

    private void setCacheMode() {
        ConnectivityManager cm = (ConnectivityManager) this.getSystemService(Activity.CONNECTIVITY_SERVICE);
        if(cm != null && cm.getActiveNetworkInfo() != null && cm.getActiveNetworkInfo().isConnected()){
            webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        }
        else{
            webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        }
    }
}




