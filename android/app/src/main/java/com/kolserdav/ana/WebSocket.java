package com.kolserdav.ana;

import android.util.Log;
import java.net.URI;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;


public class WebSocket extends WebSocketClient {

    private static final String TAG = "WebSocket";

    public WebSocket(URI serverUri) {
        super(serverUri);
    }

    @Override
    public void onOpen(ServerHandshake handshake) {
        Log.d(TAG, "Connect with status : " + handshake.getHttpStatusMessage());
    }

    @Override
    public void onMessage(String message) {
        Log.d(TAG, "Message received: " + message);
    }

    @Override
    public void onClose(int code, String reason, boolean remote) {
        Log.d(TAG, "Close connection: " + reason);
    }

    @Override
    public void onError(Exception e) {
        e.printStackTrace();
        Log.e(TAG, "WebSocket error: " + e.getMessage());
    }

}