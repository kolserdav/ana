package com.kolserdav.ana;

class AppInterface {
    int id = 1;
    String url = null;
    String path = "/";

    String urlDefault = "https://test.uyem.ru";

    public AppInterface(int _id, String _url, String _urlDefault, String _path) {
        id = _id;
        url = _url;
        urlDefault = _urlDefault;
        path = _path;
    }

    public AppInterface() {

    }

}

public class Config {

    public static final int FIRST_LOAD_DURATION = 1000;

    public static final String CHECK_URL_PATH = "/api/check";


}

