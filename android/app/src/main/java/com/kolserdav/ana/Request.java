package com.kolserdav.ana;

import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class Request extends AsyncTask<Void, Void, String> {

    public int status = 500;

    private URL url;

    private static final String TAG = "Request";

    Request(String _url) {
        super();
        try {
            url = new URL(_url);
        } catch (MalformedURLException e) {
            Log.e(TAG, "Error create url from string: " + e.getMessage());
        }
    }

    protected String doInBackground(Void... params) {
        Log.d(TAG, "Request to: " + url);
        try {
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
            Log.d(TAG, "Status " + this.status);
            onGetStatus(status);
        }

    }
}
