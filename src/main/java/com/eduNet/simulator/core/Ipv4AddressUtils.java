package com.eduNet.simulator.core;

public final class Ipv4AddressUtils {

    private Ipv4AddressUtils() {
    }

    public static int toInt(String dottedDecimal) {
        String[] parts = dottedDecimal.trim().split("\\.");
        if (parts.length != 4) {
            throw new IllegalArgumentException("Nieprawidłowy adres IPv4: " + dottedDecimal);
        }
        int result = 0;
        for (String part : parts) {
            int octet;
            try {
                octet = Integer.parseInt(part);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Nieprawidłowy adres IPv4: " + dottedDecimal);
            }
            if (octet < 0 || octet > 255) {
                throw new IllegalArgumentException("Oktet poza zakresem 0-255 w adresie: " + dottedDecimal);
            }
            result = (result << 8) | octet;
        }
        return result;
    }

    public static String toDottedDecimal(int address) {
        return ((address >>> 24) & 0xFF) + "." + ((address >>> 16) & 0xFF) + "." + ((address >>> 8) & 0xFF) + "." + (address & 0xFF);
    }

    public static boolean isValid(String dottedDecimal) {
        try {
            toInt(dottedDecimal);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public static String toBinaryString(int address) {
        StringBuilder sb = new StringBuilder();
        for (int i = 31; i >= 0; i--) {
            sb.append((address >>> i) & 1);
        }
        return sb.toString();
    }

}
