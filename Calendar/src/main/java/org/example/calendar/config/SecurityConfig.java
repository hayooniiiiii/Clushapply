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
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.CorsFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final PrincipalOauth2UserService principalOauth2UserService;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final UserRepository userRepository;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final CorsFilter corsFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        AuthenticationManager authenticationManager = authenticationConfiguration.getAuthenticationManager();

        JwtTokenProvider jwtTokenProvider = new JwtTokenProvider();

        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(authenticationManager, jwtTokenProvider);
        //jwtAuthenticationFilter.setFilterProcessesUrl("/login/user/check");

        JwtAuthorizationFilter jwtAuthorizationFilter = new JwtAuthorizationFilter(authenticationManager, userRepository);

        http
                .csrf(AbstractHttpConfigurer::disable) // CSRF 비활성화
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션 사용 X
                .addFilter(corsFilter) // CORS 필터를 인증 필터보다 먼저 실행
                .addFilter(jwtAuthenticationFilter) // JWT 인증 필터 추가
                .addFilter(jwtAuthorizationFilter) // JWT 권한 필터 추가
                .authorizeHttpRequests(authorize ->
                        authorize.anyRequest().permitAll()
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
