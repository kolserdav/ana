package com.kolserdav.ana;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import androidx.core.content.res.TypedArrayUtils;

import java.sql.Array;
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

    public void  onCreate() {}
}

class AppInterface {
    Integer id = 1;
    String url = "https://uyem.ru";

    public AppInterface(Integer _id, String _url) {
        id = _id;
        url = _url;
    }

}

class App extends Table {

    public static final String TABLE_NAME = "app";
    public static final String APP_COLUMN_ID = "id";
    public static final String APP_COLUMN_URL = "url";

    public AppInterface schema;

    public App(SQLiteDatabase db) {
        super(db, new String[]{
                APP_COLUMN_ID,
                APP_COLUMN_URL});

    }

    public void onCreate() {
        db.execSQL("CREATE TABLE " + TABLE_NAME + " (" +
                APP_COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                APP_COLUMN_URL + " TEXT" + ")");
    }

    public void setApp(AppInterface options) {
        db.execSQL("UPDATE " + TABLE_NAME +
                " SET " + APP_COLUMN_URL + options.url +
                " WHERE " + APP_COLUMN_ID + "=" + options.id);
    }

    public void insert() {
        Cursor cursor = db.query(
                TABLE_NAME,
                projections,
                null,
                null,
                null,
                null,
                null
        );
        if (cursor.getCount() == 0) {
            db.execSQL("INSERT INTO " + TABLE_NAME +
                    " (" + APP_COLUMN_ID + ", " + APP_COLUMN_URL + ") VALUES" + " (" + null + ", '" + schema.url + "')");
        }
    }

    public AppInterface init() {
        insert();
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
        Integer id = 1;
        String url = "";
        while (cursor.moveToNext()) {
            id = cursor.getInt(getAppColumnIndex(APP_COLUMN_ID));
            url = cursor.getString(getAppColumnIndex(APP_COLUMN_URL));
        }
        schema = new AppInterface(id, url);
        return schema;
    }

}


public class DB extends SQLiteOpenHelper {

    SQLiteDatabase sqLiteDatabase;

    App app;

    public static final Integer DATABASE_VERSION = 2;
    public static final String DATABASE_NAME = "db";

    public DB(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
        sqLiteDatabase = getWritableDatabase();
        app = new App(sqLiteDatabase);
        app.init();
    }

    @Override
    public void onCreate(SQLiteDatabase _sqLiteDatabase) {
        sqLiteDatabase = _sqLiteDatabase;

        app.onCreate();
    }





    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {
        sqLiteDatabase.execSQL("DROP TABLE IF EXISTS " + app.TABLE_NAME);
        onCreate(sqLiteDatabase);
    }
}