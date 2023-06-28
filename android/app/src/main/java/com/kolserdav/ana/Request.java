package com.kolserdav.ana;

import android.content.Context;
import android.util.Log;

import org.chromium.net.CronetEngine;
import org.chromium.net.CronetException;
import org.chromium.net.UrlRequest;
import org.chromium.net.UrlResponseInfo;

import java.nio.ByteBuffer;
import java.util.List;
import java.util.Map;
import java.util.function.Function;


class Request extends UrlRequest.Callback {

    Context context;

    ByteBuffer buffer;

    MainActivity.Check callback;

    public static final String CHARSET = "UTF-8";

    Request(Context _context) {
        super();
        context = _context;
    }

    public CronetEngine buildRequest(MainActivity.Check _callback) {
        callback = _callback;
        CronetEngine.Builder myBuilder = new CronetEngine.Builder(context);
        CronetEngine cronetEngine = myBuilder.build();
        return cronetEngine;
    }

    @Override
    public void onFailed(UrlRequest request, UrlResponseInfo info, CronetException error) {
        Log.e(TAG, "Request failed" + error);
    }

    private static final String TAG = "Request";

    @Override
    public void onRedirectReceived(UrlRequest request, UrlResponseInfo info, String newLocationUrl) {
        Log.i(TAG, "onRedirectReceived method called.");
        // You should call the request.followRedirect() method to continue
        // processing the request.
        request.followRedirect();
    }

    @Override
    public void onResponseStarted(UrlRequest request, UrlResponseInfo info) {
        Log.i(TAG, "onResponseStarted method called.");
        // You should call the request.read() method before the request can be
        // further processed. The following instruction provides a ByteBuffer object
        // with a capacity of 102400 bytes for the read() method. The same buffer
        // with data is passed to the onReadCompleted() method.
        request.read(ByteBuffer.allocateDirect(102400));
    }

    @Override
    public void onReadCompleted(UrlRequest request, UrlResponseInfo info, ByteBuffer byteBuffer) {
        buffer = byteBuffer;
        List<Map.Entry<String, String>> headers = info.getAllHeadersAsList();

        Integer length = 0;
        for (int i = 0; i < headers.size(); i++ ) {
            Map.Entry<String, String> header =  headers.get(i);
            if (header.getKey().equals("Content-Length")) {
                length = Integer.parseInt(header.getValue());
            };
        }

        String data = new String(buffer.array(), 0, length + 8);
        Log.i(TAG, "onReadCompleted method called: " + data.trim() +
                " from url " + info.getUrl() + " and status " + info.getHttpStatusText());
        byteBuffer.clear();
        request.read(byteBuffer);

        callback.onGetStatusCode(info.getHttpStatusCode());
    }

    @Override
    public void onSucceeded(UrlRequest request, UrlResponseInfo info) {
        Log.i(TAG, "onSucceeded method called.");
    }
}

