package org.example.calendar.config;

import org.springframework.web.filter.CorsFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        // UrlBasedCorsConfigurationSource 객체를 생성합니다. 이 객체는 URL 패턴별로 CORS 구성을 적용할 수 있도록 도와줍니다.
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        // 자격 증명(쿠키, 인증 헤더 등)을 포함한 요청을 허용할지를 설정합니다.
        // true로 설정하면 클라이언트가 자격 증명을 포함하여 요청을 보낼 수 있습니다.
        //내 서버가 응답을 할때 json을 자바스크립트에서 처리할수 있게 할지를 설정
        config.setAllowCredentials(true);
        // 모든 도메인에서의 요청을 허용합니다.
        // 예를 들어, https://example.com에서 오는 요청뿐만 아니라 다른 모든 도메인에서 오는 요청을 허용합니다.
        //모든 ip에 응답을 허용하겠다.
        //config.addAllowedOrigin("*");
        config.addAllowedOrigin("http://localhost:3000");
        // 모든 헤더를 허용합니다.
        // 클라이언트가 보내는 요청에 포함된 모든 헤더를 서버가 허용합니다.
        config.addAllowedHeader("*");

        // 모든 HTTP 메서드(POST, GET, PUT, DELETE, PATCH 등)를 허용합니다.
        // 클라이언트가 어떤 HTTP 메서드를 사용하든 서버가 이를 허용합니다.
        config.addAllowedMethod("*");

        // "/api/**" 패턴으로 들어오는 모든 요청에 대해 위에서 설정한 CORS 구성을 적용합니다.
        // "/api/"로 시작하는 모든 경로에 대해 이 CORS 설정이 적용됩니다.
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}