package com.kolserdav.ana;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;


import java.util.Arrays;

abstract class Table {
    SQLiteDatabase db;
    String[] projections = {};



    public Integer getAppColumnIndex(String field) {
        return Arrays.asList(projections).indexOf(field);
    }

    public Table(SQLiteDatabase _db, String[] _projections) {
        projections = _projections;
        db = _db;
    }
}



class App extends Table {

    public static final String TABLE_NAME = "app";
    public static final String APP_COLUMN_ID = "id";
    public static final String APP_COLUMN_URL = "url";

    public static final String APP_COLUMN_URL_DEFAULT = "urlDefault";
    public static final String APP_COLUMN_PATH = "path";

    private static final String TAG = "App";

    public App(SQLiteDatabase db) {
        super(db, new String[]{
                APP_COLUMN_ID,
                APP_COLUMN_URL,
                APP_COLUMN_URL_DEFAULT,
                APP_COLUMN_PATH
        });
    }

    public void onCreate() {
        db.execSQL("CREATE TABLE IF NOT EXISTS " + TABLE_NAME + " (" +
                APP_COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                APP_COLUMN_URL + " TEXT, " + APP_COLUMN_URL_DEFAULT + " TEXT, " +
                APP_COLUMN_PATH + " TEXT" + ")");
    }

    public void setUrl(AppInterface options) {
        db.execSQL("UPDATE " + TABLE_NAME +
                " SET " + APP_COLUMN_URL + "='" + options.url + "'" +
                " WHERE " + APP_COLUMN_ID + "=" + options.id);
        Log.d(TAG, "Url saved " + options.url);
    }

    @Deprecated
    public void clear() {
        db.execSQL("DELETE FROM " + TABLE_NAME);
    }

    @Deprecated
    public void drop() {
        clear();
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_NAME);
    }

    public void setPath(AppInterface options) {
        Log.d("INFO", "Update path " + options.path + " with id " + options.id);
        db.execSQL("UPDATE " + TABLE_NAME +
                " SET " + APP_COLUMN_PATH + "='" + options.path + "'" +
                " WHERE " + APP_COLUMN_ID + "=" + options.id);
    }

    public AppInterface init(AppInterface options) {
        // String selection = APP_COLUMN_ID + "=?";
        // String[] selectionArgs = {"%" + id + "%"};
        Cursor cursor = db.query(
                TABLE_NAME,
                projections,
                null,
                null,
                null,
                null,
                null
        );
        int count = cursor.getCount();
        if (count == 0) {
            db.execSQL(
                    "INSERT INTO " + TABLE_NAME +
                    " (" +
                            APP_COLUMN_ID + ", " +
                            APP_COLUMN_URL + ", " +
                            APP_COLUMN_URL_DEFAULT + ", " +
                            APP_COLUMN_PATH +  ") " +
                    "VALUES" +
                    " (" +
                    null + ", '" +
                    options.url + "', '" +
                    options.urlDefault + "', '" +
                    options.path + "')"
            );
            return init(options);
        }
        if (count != 1) {
            Log.w(TAG,"App cursor count is " + count);
        }

        AppInterface schema = options;
        while (cursor.moveToNext()) {
            schema.id = cursor.getInt(getAppColumnIndex(APP_COLUMN_ID));
            schema.url = cursor.getString(getAppColumnIndex(APP_COLUMN_URL));
            schema.urlDefault = cursor.getString(getAppColumnIndex(APP_COLUMN_URL_DEFAULT));
            schema.path = cursor.getString(getAppColumnIndex(APP_COLUMN_PATH));
        }
        return schema;
    }

}



public class DB extends SQLiteOpenHelper {

    SQLiteDatabase sqLiteDatabase;

    App app;

    public static final Integer DATABASE_VERSION = 12;
    public static final String DATABASE_NAME = "db";

    MainActivity context;

    public DB(MainActivity _context) {
        super(_context, DATABASE_NAME, null, DATABASE_VERSION);
        context = _context;
        sqLiteDatabase = getWritableDatabase();
        app = new App(sqLiteDatabase);
        app.onCreate();
        onCreate(sqLiteDatabase);
    }

    @Override
    public void onCreate(SQLiteDatabase _sqLiteDatabase) {
        sqLiteDatabase = _sqLiteDatabase;
    }





    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {
        sqLiteDatabase.execSQL("DROP TABLE IF EXISTS " + app.TABLE_NAME);
        onCreate(sqLiteDatabase);
    }

}