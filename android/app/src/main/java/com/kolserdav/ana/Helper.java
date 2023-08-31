package com.kolserdav.ana;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;


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

    public Boolean handleRegex(String patternBase, String patternPart) {
        Pattern pattern = Pattern.compile(patternPart, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(patternBase);
        return matcher.find();
    }

    public String getPackageVersion(Context context) {
        String result = null;
        try {
            PackageManager manager = context.getPackageManager();
            PackageInfo info = manager.getPackageInfo(
                    context.getPackageName(), 0);
            result = info.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(TAG, "Failed get package version: " + e.getMessage());
        }
        return result;
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
            String query = path.getQuery();
            if (query != null) {
                url = url.concat("?");
                url = url.concat(query);
            }
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

    public void alert(String title, String message) {
        new AlertDialog.Builder(context)
                .setTitle(title)
                .setMessage(message)

                // Specifying a listener allows you to take an action before dismissing the dialog.
                // The dialog is automatically dismissed when a dialog button is clicked.
                .setPositiveButton(android.R.string.yes, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        // Continue with delete operation
                    }
                })

                // A null listener allows the button to dismiss the dialog and take no further action.
                .setNegativeButton(android.R.string.no, null)
                .setIcon(android.R.drawable.ic_dialog_alert)
                .show();
    }

}
