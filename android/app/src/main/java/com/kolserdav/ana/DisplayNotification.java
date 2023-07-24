package com.kolserdav.ana;

import android.app.PendingIntent;
import android.content.Intent;
import android.app.Service;
import android.net.Uri;
import android.os.*;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;


public class DisplayNotification extends Service {

    private final String TAG = "DisplayNotification";

    public static final String INTENT_EXTRA_NAME_URL = "url";

    public static final String INTENT_EXTRA_NAME_WS_ADDRESS = "ws_address";

    public static final String INTENT_EXTRA_NAME_NOTIFICATION_UNIT_ID = "notification_unit_id";

    private String wsAddress = null;

    private String url = null;

    private String unitId = null;

    public void createNotification(String title, String content, String path) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.setData(Uri.parse(url + path));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        int requestID = (int) System.currentTimeMillis();
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            flags = PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent pendingIntent = PendingIntent.getActivity(this, requestID, intent, flags);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, Config.CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setStyle(new NotificationCompat.BigTextStyle()
                        .bigText(content))

                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        notificationManager.notify(requestID, builder.build());
        Log.d(TAG, "Show notification: " + title + " " + content + " " + path);
    }

    private void listenNotifications() {
        URI uri = null;
        try {
            uri = new URI(wsAddress);
        } catch (URISyntaxException e) {
            Log.e(TAG, "Error create WebSocket URI: " + e.getMessage());
        }

        if (uri != null) {
            WebSocket ws = new WebSocket(uri) {

                @Override
                public void onError(Exception ex) {
                    Log.e(TAG, "WS on error: " + ex.getMessage());
                    ex.printStackTrace();
                }

                @Override
                public void onOpen(ServerHandshake handshake) {
                    super.onOpen(handshake);
                    JSONObject obj = new JSONObject();
                    try {
                        obj.put("message", Config.WS_MESSAGE_NOTIFICATION_USER_ID);
                        obj.put("data", unitId);
                    } catch (JSONException e) {
                        Log.e(TAG, "Failed create JSON object: " + e.getMessage());
                    }
                    send(obj.toString());
                }

                @Override
                public void onClose(int code, String reason, boolean remote) {
                    super.onClose(code, reason, remote);
                    try {
                        Thread.sleep(Config.WS_RECONNECT_TIMEOUT);
                    } catch (InterruptedException e) {
                        Log.e(TAG, "Failed wait reconnect WS: " + e.getMessage());
                    }
                    listenNotifications();
                }

                @Override
                public void onMessage(String message) {
                    super.onMessage(message);
                    JSONObject data = null;
                    try {
                        data = new JSONObject(message);
                    } catch (JSONException e) {
                        Log.e(TAG, "Failed parse WS message: " + e.getMessage());
                    }
                    if (data != null) {
                        try {
                            String title = data.get("type").toString();
                            String content = data.get("message").toString();
                            String path = data.get("data").toString();
                            createNotification(title, content, path);
                        } catch (JSONException e) {
                            Log.e(TAG, "Failed parse WS message: " + e.getMessage());
                        }
                    } else {
                        Log.w(TAG, "Skipped show notification, because data is null");
                    }
                }
            };
            SSLContext sslContext = null;
            try {
                sslContext = SSLContext.getInstance( "TLS" );
                sslContext.init( null, Config.TRUST_ALL_CERTS, new SecureRandom());
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            } catch (KeyManagementException e) {
                e.printStackTrace();
            }
            if (sslContext != null) {
                SSLSocketFactory factory = sslContext.getSocketFactory();
                ws.setSocketFactory(factory);
                ws.connect();
            } else {
                Log.w(TAG, "Skipped connect to WS: sslContext is null");
            }
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Thread thread = new Thread() {
            @Override
            public void run() {
                super.run();
                while (url == null) {}
                Log.d(TAG, "Notifications service is running: " + wsAddress + ", " + url);
                listenNotifications();
            }
        };
        thread.start();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Bundle extras = intent.getExtras();
        if (extras == null) {
            Log.w(TAG, "Extras is null");
        } else {
            wsAddress = extras.get(INTENT_EXTRA_NAME_WS_ADDRESS).toString();
            url = extras.get(INTENT_EXTRA_NAME_URL).toString();
            unitId = extras.get(INTENT_EXTRA_NAME_NOTIFICATION_UNIT_ID).toString();
        }
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "Service destroyed");
    }
}