package org.example.calendar.oauth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.calendar.Jwt.JwtProperties;
import org.example.calendar.auth.PrincipalDetails;
import org.example.calendar.entity.User;
import org.example.calendar.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Date;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public OAuth2AuthenticationSuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        User user = principalDetails.getUser();

        boolean isFirstLogin = principalDetails.isFirstLogin();
        //System.out.println(isFirstLogin);


        //  JWT 토큰 생성
        String jwtToken = JWT.create()
                .withSubject(user.getUserEmail())
                .withExpiresAt(new Date(System.currentTimeMillis() + JwtProperties.EXPIRATION_TIME))
                .withClaim("userId", user.getUserId())
                .withClaim("userEmail", user.getUserEmail())
                .sign(Algorithm.HMAC512(JwtProperties.SECRET));

        response.addHeader(JwtProperties.HEADER_STRING, JwtProperties.TOKEN_PREFIX + jwtToken);

        // JWT Cookie 설정
        Cookie jwtCookie = new Cookie("jwtToken", jwtToken);
        jwtCookie.setHttpOnly(false);
        jwtCookie.setSecure(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(jwtCookie);

        //  Refresh Token 생성
        String refreshToken = JWT.create()
                .withSubject(user.getUserEmail())
                .withExpiresAt(new Date(System.currentTimeMillis() + JwtProperties.REFRESH_EXPIRATION_TIME))
                .withClaim("userId", user.getUserId())
                .sign(Algorithm.HMAC512(JwtProperties.SECRET));

        //  최초 로그인과 기존 로그인에 따라 Redirect 설정
        if (isFirstLogin) {
            response.sendRedirect("http://localhost:3000/profile?UserId=" + user.getUserId());
        } else {
            response.sendRedirect("http://localhost:3000/calendar?UserId=" + user.getUserId());
        }
    }
}
