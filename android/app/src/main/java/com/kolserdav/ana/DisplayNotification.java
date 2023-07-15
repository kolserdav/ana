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

import java.net.URI;
import java.net.URISyntaxException;


public class DisplayNotification extends Service {

    private final String TAG = "DisplayNotification";

    public static final String INTENT_EXTRA_NAME_URL = "url";

    public static final String INTENT_EXTRA_NAME_WS_ADDRESS = "ws_address";

    private String wsAddress = null;

    private String url = null;

    public void createNotification(String title, String content, String path) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.setData(Uri.parse(url + path));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        int requestID = (int) System.currentTimeMillis();
        PendingIntent pendingIntent = PendingIntent.getActivity(this, requestID, intent, PendingIntent.FLAG_IMMUTABLE);
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, Config.CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(content)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        notificationManager.notify(requestID, builder.build());
    }



    @Override
    public void onCreate() {
        super.onCreate();
        Thread thread = new Thread() {
            @Override
            public void run() {
                super.run();
                // TODO listen notifications
                while (url == null) {}
                Log.d(TAG, "Notifications service is running: " + wsAddress + ", " + url);
                URI uri = null;
                try {
                   uri = new URI(wsAddress);
                } catch (URISyntaxException e) {
                    Log.e(TAG, "Error create WebSocket URI: " + e.getMessage());
                }
                if (uri != null) {
                    WebSocket ws = new WebSocket(uri);
                    ws.connect();
                }
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
        }
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }
}