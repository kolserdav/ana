package com.kolserdav.ana;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.net.Uri;
import android.util.Log;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

public class Helper extends Config {


    Context context = null;

    Activity activity = null;

    public Helper(Context _context, Activity _activity) {
        context = _context;
        activity = _activity;
    }

    public Helper() {
        //
    }


    public String listenProcessText(Intent intent, AppInterface options) {
        Log.d("INFO", "Listen process text with url " + options.url + " and path " + options.path);
        String url = options.url;


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
        Log.d("PATH", options.path);
        // Parse deep link
        Uri path = intent.getData();
        if (path != null) {
            url = url.concat(path.getPath());
            url = url.concat("?");
            url = url.concat(path.getQuery());
        } else {
            url.concat(options.path);
        }
        return url;
    }

    public void microphoneAccess() {
        if (context == null || activity == null) {
            Log.w("NOT_IMPLEMENT", "Context or activity is missing");
            return;
        }
        if (ContextCompat.checkSelfPermission(context, android.Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            // Permission has not been granted, request permission
            ActivityCompat.requestPermissions(activity, new String[]{Manifest.permission.RECORD_AUDIO}, 1);
        } else {
            // Permission has already been granted
            // Setup audio recording
        }
    }

    public void setLocale(Resources resources, String languageCode) {
        Locale locale = new Locale(languageCode);
        Locale.setDefault(locale);
        Configuration config = resources.getConfiguration();
        config.setLocale(locale);
        resources.updateConfiguration(config, resources.getDisplayMetrics());
    }
}
