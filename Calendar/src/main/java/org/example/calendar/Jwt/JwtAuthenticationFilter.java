package org.example.calendar.Jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.calendar.auth.PrincipalDetails;
import org.example.calendar.entity.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.UUID;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;

    private final JwtTokenProvider jwtTokenProvider;

    // /account/login 요청을 하면 로그인 시도를 위해서 실행되는 함수
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        //System.out.println("JwtAuthenticationFilter: 로그인 시도중");
        //1.username,password를 받아서
        try {
            /*if (request.getInputStream() == null || request.getInputStream().available() == 0) {
                throw new RuntimeException("Request input is empty or invalid");
            }*/
            /*
             * BufferedReader br=request.getReader(); String input=null;
             * while((input=br.readLine())!=null) { System.out.println(input); }
             */
            //System.out.println(request.getInputStream().toString());
            //getInputStream():username과 패스워드가 담아져있다.
            //->이것보다 쉬운 방법이 있음

            ObjectMapper om=new ObjectMapper();
            User user=om.readValue(request.getInputStream(), User.class);
            //json 데이터를 dto에 파싱해서 넣어주는 objectmapper
            //System.out.println(userDto);

            UsernamePasswordAuthenticationToken authenticationToken=
                    new UsernamePasswordAuthenticationToken(user.getUserEmail(), user.getUserName());
            //PrincipalDetailsService에서 loaduserbyname실행된 후 정상이면 authentication이 리턴이된다.
            //db에 있는 username과 password가 일치한다.
            Authentication authentication=authenticationManager.authenticate(authenticationToken);
            //authentication에는 내 로그인한 정보가 담겨짐
            //print되면 로그인되었다는 뜻
            PrincipalDetails principalDetails=(PrincipalDetails)authentication.getPrincipal();

            //System.out.println("로그인완료됨 "+principalDetails.getUserDto().getUser_email());//로그인 정상적으로 됨

            //authentication 객체가 session영역에 저장을 해야하고 그방법이 return해주면됨
            //리턴의 이유는 권한 관리를 security가 대신 해주기 때문에 편하려고 하는거임
            //굳이 jwt토큰을 사용하면서 세션을 만들이유가 없음 근데 단지 권한 처리때문에 session에 넣어줌
            return authentication;

        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        //2.정상인지 로그인 시도를 해본다. authenticationManager로 로그인시도를 하면 principaldetailsservice호출
        //3.principaldetails를 세션에 담고(굳이 여기 세션에 담는 이유는 권한관리를 위해서!)
        //4. jwt토큰을 만들어서 응답해주면됨.

        return null;
    }
    //attemptAuthentication실행 중 인증이 정상적으로 되었으면successfulAuthentication함수가 실행됨
    //jwt토큰을 만들어서 request 요청한 사용자에게 jwt 토큰을 response해주면됨.
    //즉 successfulAuthentication실행되었다는건 인증이 완료되었다는 것!
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {

        //System.out.println("successfulAuthentication실행됨: 인증이 완료되었다는 뜻임.");
        PrincipalDetails principalDetails=(PrincipalDetails)authResult.getPrincipal();
        //rsa방식은 아니고, hash암호방식
        //서버만 알고있는 secret키가 있어야함
        //System.out.println("jwt토큰 실행");


        String jwtToken = jwtTokenProvider.createToken(principalDetails.getUser().getUserId(), principalDetails.getUser().getUserEmail());
        String refreshToken = jwtTokenProvider.createToken(principalDetails.getUser().getUserId(), principalDetails.getUser().getUserEmail(), JwtProperties.REFRESH_EXPIRATION_TIME);

        // 기기별 식별자 (랜덤 UUID 생성)
        String deviceId = UUID.randomUUID().toString();
        // Refresh Token을 데이터베이스에 저장

        // JWT 토큰을 HttpOnly 쿠키에 저장
        Cookie jwtCookie = new Cookie("jwtToken", jwtToken);
        jwtCookie.setHttpOnly(false);  // XSS 보호
        jwtCookie.setSecure(true);    // HTTPS에서만 전송 (배포 환경에서 적용)
        jwtCookie.setPath("/");       // 애플리케이션 전체에 사용 가능
        jwtCookie.setMaxAge((int) (JwtProperties.EXPIRATION_TIME / 1000)); // 만료 시간 설정 (초 단위)

        // Refresh Token을 HttpOnly 쿠키에 저장
        int refreshTokenExpiryTime = (int) (JwtProperties.REFRESH_EXPIRATION_TIME / 1000); // 초 단위로 변환
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(false);
        refreshTokenCookie.setSecure(true); // HTTPS에서만 전송 (배포 환경에서만 적용)
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(refreshTokenExpiryTime); // 쿠키 만료 시간을 Refresh Token 만료 시간과 동일하게 설정


        // 쿠키 추가
        response.addCookie(jwtCookie);
        response.addCookie(refreshTokenCookie);

//        response.addCookie(refreshTokenCookie);
//        //super.successfulAuthentication(request, response, chain, authResult);
//        response.addHeader(JwtProperties.HEADER_STRING,JwtProperties.TOKEN_PREFIX + jwtToken);//헤더에 담길내용으로 응답되는 형식
//        //System.out.println(jwtToken);
//        //jwt토큰 반환
    }



}


//유저네임, 패스워드 로그인이 정상이면
//서버쪽에서 세션 id를 생성해서
//클라이언트 쿠키 세션 id를응답하면 요청할때마다 쿠키값 세션 id를 항상 들고 서버쪽으로 요청하기 때문에
//서버는 세션 id가 유효한지 판단해서 유효하면 인증이 필요한 페이지로 접근하게 하면된다.
/*근데 이번 방식은
유저네임, 패스워드 로그인이 정상이면 jwt 토큰을 생성해서 클라이언트쪽으로 jwt토큰을 응답해준다.
요청할때마다 jwt토큰을 가지고 요청하면 서버는 jwt토큰이 유효한지를 판단해야하는데
이걸 해야하는 필터를 만들어주면된다.*/