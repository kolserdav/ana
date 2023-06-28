package com.kolserdav.ana;

import java.util.EventListener;

public class Event implements EventListener {

    Event() {
        super();
    }

    public String onTrigger() {
        return "Synchronously running callback function";
    }
}