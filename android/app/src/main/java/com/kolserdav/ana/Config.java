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

    public static final int FIRST_LOAD_DURATION = 3000;

    // Dependency packages/app/types/interfaces.ts.CHECK_URL_PATH
    public static final String CHECK_URL_PATH = "/api/check";

    public static final Integer DATABASE_VERSION = 18;

    public static final String DATABASE_NAME = "db";

    // Dependency PROCESS_TEXT_QUERY_STRING in packages/app/utils/constants.ts
    public static final String QUERY_STRING_PROCESS_TEXT = "process_text";
}

