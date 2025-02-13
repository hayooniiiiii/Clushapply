package org.example.calendar.Jwt;

public interface JwtProperties {
    String SECRET="calendiary";
    int EXPIRATION_TIME=5400000;
    String TOKEN_PREFIX="Bearer ";
    String HEADER_STRING="Authorization";
    long REFRESH_EXPIRATION_TIME = 3000000000L;
}
