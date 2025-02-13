package org.example.calendar.config;

import lombok.RequiredArgsConstructor;

import org.example.calendar.Jwt.JwtAuthenticationFilter;
import org.example.calendar.Jwt.JwtAuthorizationFilter;
import org.example.calendar.Jwt.JwtTokenProvider;
import org.example.calendar.oauth.OAuth2AuthenticationSuccessHandler;
import org.example.calendar.repository.UserRepository;
import org.example.calendar.service.PrincipalOauth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final PrincipalOauth2UserService principalOauth2UserService;
    private final CorsFilter corsFilter;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final UserRepository userRepository;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {


        AuthenticationManager authenticationManager = authenticationConfiguration.getAuthenticationManager();

        // JWT Token Provider 생성
        JwtTokenProvider jwtTokenProvider = new JwtTokenProvider();

        // JWT Authentication Filter 생성 및 설정
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(authenticationManager, jwtTokenProvider);
        jwtAuthenticationFilter.setFilterProcessesUrl("/login/user/check"); // 로그인 요청 처리 경로

        // JWT Authorization Filter 생성
        JwtAuthorizationFilter jwtAuthorizationFilter = new JwtAuthorizationFilter(authenticationManager, userRepository);

        http
                .csrf(AbstractHttpConfigurer::disable) // CSRF 비활성화
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 세션 상태를 Stateless로 설정
                )
                .addFilter(corsFilter) // CORS 필터 추가
                .addFilter(jwtAuthenticationFilter) // JWT 인증 필터 추가
                .addFilter(jwtAuthorizationFilter) // JWT 권한 필터 추가
                .authorizeHttpRequests(authorize ->
                        authorize
                                .anyRequest().permitAll()
                )
                .oauth2Login(oauth2 ->
                        oauth2
                                .successHandler(oAuth2AuthenticationSuccessHandler) // 로그인 성공 후 처리 핸들러
                                .userInfoEndpoint(userInfoEndpoint ->
                                        userInfoEndpoint.userService(principalOauth2UserService) // OAuth2 사용자 정보 처리
                                )
                );

        return http.build();
    }
}