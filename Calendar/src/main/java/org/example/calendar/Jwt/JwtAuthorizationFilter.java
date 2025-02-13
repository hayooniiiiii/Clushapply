package org.example.calendar.Jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.calendar.auth.PrincipalDetails;
import org.example.calendar.entity.User;
import org.example.calendar.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.io.IOException;
import java.util.Optional;

public class JwtAuthorizationFilter extends BasicAuthenticationFilter {


    private final UserRepository userRepository;

    public JwtAuthorizationFilter(AuthenticationManager authenticationManager, UserRepository userRepository ) {
        super(authenticationManager);


        this.userRepository = userRepository;
    }

    //인증이나 권한이 필요한 주소요청이 있을때 해당 필터를 타게됨
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        //super.doFilterInternal(request, response, chain);
        //System.out.println("인증이나 권한이 필요한 주소 요청이됨");

        String jwtHeader=request.getHeader("Authorization");

        //System.out.println("jwtHeader:"+jwtHeader);
        //header가 있는지 확인
        if(jwtHeader==null||!jwtHeader.startsWith("Bearer")) {
            chain.doFilter(request, response);
            return;
        }

        System.out.println(request.getHeader(JwtProperties.HEADER_STRING).replace("Bearer ", ""));
        //jwt토큰을 검증을해서 정상적인 사용자인지 확인
        String jwtToken=request.getHeader(JwtProperties.HEADER_STRING).replace("Bearer ", "");

        String userEmail= JWT.require(Algorithm.HMAC512(JwtProperties.SECRET)).build().
                verify(jwtToken).
                getClaim("userEmail").
                asString();
        //System.out.println(user_email);
        //서명이 정상적으로됨
        if (userEmail != null) {
            Optional<User> userOptional = userRepository.findByUserEmail(userEmail);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                PrincipalDetails principalDetails = new PrincipalDetails(user);
                Authentication authentication = new UsernamePasswordAuthenticationToken(principalDetails, null, principalDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }


    }

}