package com.eduNet.simulator.lab;

import java.io.ByteArrayOutputStream;

/**
 * Usuwa z surowego strumienia bajtów sekwencje negocjacji opcji telnetu (IAC WILL/WONT/DO/DONT
 * oraz subnegocjacje IAC SB ... IAC SE), które BusyBox telnetd wysyła na starcie połączenia.
 * Bez tego filtra pierwsze bajty wyświetlone w terminalu użytkownika zawierałyby widoczny "szum"
 * (0xFF i towarzyszące mu bajty poleceń). Nie odpowiada na negocjacje — w testach ręcznych
 * telnetd działał poprawnie także bez żadnej odpowiedzi zwrotnej.
 */
public final class TelnetIacFilter {

    private static final int IAC = 0xFF;
    private static final int SB = 250;
    private static final int SE = 240;

    private enum State { NORMAL, IAC_SEEN, COMMAND, SUBNEG, SUBNEG_IAC }

    private State state = State.NORMAL;

    public byte[] filter(byte[] input, int length) {
        ByteArrayOutputStream out = new ByteArrayOutputStream(length);
        for (int i = 0; i < length; i++) {
            int b = input[i] & 0xFF;
            switch (state) {
                case NORMAL -> {
                    if (b == IAC) {
                        state = State.IAC_SEEN;
                    } else {
                        out.write(b);
                    }
                }
                case IAC_SEEN -> {
                    if (b == IAC) {
                        out.write(IAC);
                        state = State.NORMAL;
                    } else if (b == SB) {
                        state = State.SUBNEG;
                    } else if (b == 251 || b == 252 || b == 253 || b == 254) {
                        state = State.COMMAND;
                    } else {
                        state = State.NORMAL;
                    }
                }
                case COMMAND -> state = State.NORMAL;
                case SUBNEG -> {
                    if (b == IAC) state = State.SUBNEG_IAC;
                }
                case SUBNEG_IAC -> state = (b == SE) ? State.NORMAL : State.SUBNEG;
            }
        }
        return out.toByteArray();
    }

}
