package org.example.calendar.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.example.calendar.Jwt.JwtTokenProvider;
import org.example.calendar.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JwtService {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    /**
     * HTTP 요청에서 JWT 토큰을 추출하여 유효성을 검증한 후,
     * 해당 토큰에서 사용자 ID를 얻고, 사용자 정보를 반환하는 메서드
     *
     * @param request HTTP 요청 객체
     * @return UserDto 객체 (유효한 경우) 또는 null (유효하지 않은 경우)
     */
    public Optional<User> getUserFromJwt(HttpServletRequest request) {
        String jwtToken = extractJwtToken(request); // JWT 토큰 추출
        if (jwtToken != null && jwtTokenProvider.validateToken(jwtToken)) { // 토큰 유효성 검사
            int userId = jwtTokenProvider.getUserId(jwtToken); // 토큰에서 사용자 ID 추출
            return userService.getUserById(userId); // ID를 이용해 사용자 정보 조회 후 반환
        }
        return null;
    }

    /**
     * HTTP 요청에서 JWT 토큰을 추출하는 메서드
     * 1. Authorization 헤더에서 Bearer 토큰 방식으로 추출
     * 2. 쿠키에서 'jwtToken' 이름의 토큰을 찾음
     * @param request HTTP 요청 객체
     * @return 추출된 JWT 토큰 문자열 또는 null (토큰이 없거나 잘못된 경우)
     */
    private String extractJwtToken(HttpServletRequest request) {
        // Authorization 헤더에서 토큰 추출
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.replace("Bearer ", "");
        }

        // 쿠키에서 'jwtToken' 이름의 토큰을 찾음
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwtToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
