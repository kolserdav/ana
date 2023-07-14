package com.kolserdav.ana;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.database.sqlite.SQLiteDatabase;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Window;
import android.webkit.PermissionRequest;
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
    private static final String TAG = "MainActivity";

    public WebView mWebView;

    public DB db;

    private Helper helper;

    private Boolean firstLoad = true;

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        String url = db.getUrl();
        Uri data = intent.getData();
        if (data != null) {
            mWebView.loadUrl(url + data.getPath() + "?" + data.getQuery());
        } else {
            Log.d(TAG, "On new intent without getData");
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
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

        Intent serviceIntent = new Intent(this, DisplayNotification.class);

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

                           @Override
                           protected void onPostExecute(String response) {
                               super.onPostExecute(response);
                               Log.d(TAG, "On post execute: " + response);
                               JSONObject data = null;
                               try {
                                   data = new JSONObject(response);
                               } catch (JSONException e) {
                                   Log.e(TAG, "Error parse JSON: " + e.getMessage());
                               }
                               if (data != null) {
                                   Object wsAddress = null;
                                   try {
                                       wsAddress = data.get("data");
                                   } catch (JSONException e) {
                                       Log.e(TAG, "Error get WS address from JSON: " + e.getMessage());
                                   }
                                   Log.d(TAG, "WS server is: " + wsAddress);
                                   if (wsAddress != null) {
                                       AppInterface app = db.app.init();
                                       app.wsAddress = wsAddress.toString();
                                       db.app.setWSAddress(app);

                                       // Starting notification service
                                       serviceIntent.putExtra(DisplayNotification.INTENT_EXTRA_NAME_URL, db.getUrl());
                                       serviceIntent.putExtra(DisplayNotification.INTENT_EXTRA_NAME_WS_ADDRESS, app.wsAddress);
                                       startService(serviceIntent);
                                   }
                               }
                           }
                       }.execute().get();

                    } catch (ExecutionException e) {
                        Log.e(TAG, "Error request E " + e.getMessage());
                    }
                } catch (InterruptedException e) {
                    Log.e(TAG, "Error request I " + e.getMessage());
                }
            }
        };

        webViewListeners();

        // new DisplayNotification(db);
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
                AppInterface schema = context.db.app.init();
                String url = _url;

                Log.d(TAG, "Should override url " + url +
                        " with saved " + schema.path);

                String __url = schema.url;
                if (__url.equals("null")) {
                    __url = schema.urlDefault;
                }

                Intent intent = getIntent();
                Pattern pattern = Pattern.compile(__url, Pattern.CASE_INSENSITIVE);
                Matcher matcher = pattern.matcher(url);
                boolean matchFound = matcher.find();

                // Open other url
                if (!matchFound) {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(i);
                    return true;
                }


                // Rewrite url to saved
                if (!schema.path.equals("/") && firstLoad &&
                        !Intent.ACTION_PROCESS_TEXT.equals(intent.getAction())) {
                    url = url.replaceAll("\\/[a-z-(/)]+$", "") + schema.path;
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
                return false;
            }

            @Override
            public void doUpdateVisitedHistory(WebView view, String url, boolean isReload) {
                super.doUpdateVisitedHistory(view, url, isReload);

                AppInterface schemaApp = context.db.app.init();
                if (!firstLoad) {
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




