package com.kolserdav.ana;

import android.annotation.SuppressLint;
import android.annotation.TargetApi;

import java.net.Socket;
import java.security.cert.X509Certificate;

import javax.net.ssl.SSLEngine;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509ExtendedTrustManager;

class AppInterface {
    int id = 1;
    String url = null;
    String path = "/";
    String urlDefault = "https://uyem.ru";
    // Push notifications server
    String wsAddress = null;

    Boolean notStopWeb = false;

    public AppInterface() {

    }
}

public class Config {

    public static final int FIRST_LOAD_DURATION = 3000;

    // Dependency packages/app/types/interfaces.ts.CHECK_URL_PATH
    public static final String CHECK_URL_PATH = "/api/check";

    public static final Integer DATABASE_VERSION = 33;

    public static final String DATABASE_NAME = "db";

    // Dependency PROCESS_TEXT_QUERY_STRING in packages/app/utils/constants.ts
    public static final String QUERY_STRING_PROCESS_TEXT = "process_text";

    public static final String CHANNEL_ID = "1";

    // Dependency packages/server/src/utils/constants.ts.WS_MESSAGE_NOTIFICATION_USER_ID
    public static final String WS_MESSAGE_NOTIFICATION_USER_ID = "notification_user_id";

    public static final int WS_RECONNECT_TIMEOUT = 3000;

    // Dependency packages/app/utils/constants.ts.ANDROID_NOT_STOP_WEB_DEFAULT
    public static final Boolean NOT_STOP_WEB_DEFAULT = true;

    // FIXME comment on production
    public static final Boolean screenOn = true;

    public static final String dataImageReg = "^data:image";

    @SuppressLint("CustomX509TrustManager")
    @TargetApi(24)
    public static final TrustManager[] TRUST_ALL_CERTS = new TrustManager[]{

            new X509ExtendedTrustManager() {
                public void checkClientTrusted(X509Certificate[] chain, String authType, Socket socket) {}
                public void checkServerTrusted(X509Certificate[] chain, String authType, Socket socket) {}
                public void checkClientTrusted(X509Certificate[] chain, String authType, SSLEngine engine) {}
                public void checkServerTrusted(X509Certificate[] chain, String authType, SSLEngine engine) {}
                public void checkClientTrusted(X509Certificate[] chain, String authType) {}
                public void checkServerTrusted(X509Certificate[] chain, String authType) {}
                public X509Certificate[] getAcceptedIssuers() {
                    return new X509Certificate[0];
                }
            }
    };

}

