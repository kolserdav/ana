package com.kolserdav.ana;

import android.content.Intent;
import android.app.Service;
import android.os.*;

import androidx.annotation.Nullable;

public class DisplayNotification extends Service {

    private final String TAG = "DisplayNotification";

    @Override
    public void onCreate() {
        super.onCreate();
        Thread thread = new Thread() {
            @Override
            public void run() {
                super.run();
                // TODO listen notifications
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
    public void onDestroy() {
        super.onDestroy();
    }
}