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


public class Helper extends Config {


    public static final String TAG = "Helper";

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
        String url = options.url;
        if (url.equals("null")) {
            url = options.urlDefault;
        }
        Log.d(TAG, "Listen process text with url: " + url + ", path: " +
                options.path + ", default:  " + options.urlDefault);


        CharSequence text = intent
                .getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT);
        if (text != null) {
            url = url.concat("?" + Config.QUERY_STRING_PROCESS_TEXT + "=");
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
        } else {
            url.concat(options.path);
        }
        return url;
    }

    public void microphoneAccess() {
        if (context == null || activity == null) {
            Log.w(TAG, "Context or activity is missing");
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
