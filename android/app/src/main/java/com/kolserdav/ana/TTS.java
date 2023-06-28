package com.kolserdav.ana;

import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.util.Log;

import org.json.JSONObject;

import java.util.Locale;
import java.util.Set;

class TTS {
    TextToSpeech textToSpeech;

    Locale[] locales;

    Voice voice = null;

    Locale lang;

    Set<Voice> voices;



    public TTS(MainActivity context) {
        textToSpeech = new TextToSpeech(context, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS) {
                    voices = textToSpeech.getVoices();
                    locales = Locale.getAvailableLocales();
                    voice = textToSpeech.getDefaultVoice();
                }
            }
        });
        textToSpeech.setLanguage(Locale.US);
    }


    public Boolean getSpeechState() {
        return textToSpeech.isSpeaking();
    }

    public String setAvailableLocales() {
        Locale[] _locales = textToSpeech.getAvailableLanguages().toArray(new Locale[0]);
        JSONObject json = new JSONObject();
        for (int i = 0; i < _locales.length; i ++) {
            Locale locale = _locales[i];
            try {
                json.put(String.valueOf(i), locale.getLanguage());
            } catch (Exception e) {
                Log.d("Error json put", e.getMessage());
            }
        }
        return json.toString();
    }

    public String getVoices(String lang) {
        JSONObject json = new JSONObject();
        Voice[] _voices = voices.toArray(new Voice[0]);
        for (int i = 0; i < _voices.length; i ++) {
            Voice v = _voices[i];
            try {
                if (v.getLocale().getLanguage().matches(lang)) {
                    json.put(String.valueOf(v.getName()), v.getLocale().getDisplayName());
                }
            } catch (Exception e) {
                Log.d("Error json voice put", e.getMessage());
            }
        }
        return json.toString();
    }
    public void textToSpeak(String text) {
        textToSpeech.setVoice(this.voice);
        textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null);
    }

    public void setVoice(String language) {
        Voice[] _voices = voices.toArray(new Voice[0]);
        for (int i = 0; i < _voices.length; i ++) {
            Voice v = _voices[i];
            boolean check = v.getName().equals(language);
            if (check) {
                this.voice = v;
            }
        }
    }

    public void stopSpeak() {
        textToSpeech.stop();
    }

    public String getLanguage() {
        return textToSpeech.getVoice().getLocale().getLanguage();
    }

    public void setLanguage(String locale) {
        Locale _locale = Locale.forLanguageTag(locale);
        lang = _locale;
        textToSpeech.setLanguage(_locale);
    }

    public void setSpeechRate(String val) {
        textToSpeech.setSpeechRate(Float.valueOf(val));
    }
}