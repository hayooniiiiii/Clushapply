package org.example.calendar.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

public class Myfilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        //토큰:calendiary 넘어오면 필터를 계속 타서 인증이 되게하고,그게아니면 컨틀롤러로  이동도 못하게함
        //토큰:calendiary(이걸로 암호화)
        //이걸 만들어줘야하는데, ip,pw이 정상적으로 들어와서 로그인이 완료되면 토큰을 만들어주고 그걸 응답을 해준다.
        //요청할때마다 header에 authorization에 value값으로 토큰을 가지고와준다
        //그때 토큰이 넘어오면 이 토큰이 내가 만든 토큰이 맞는지만 검증만 하면됨.(rsa,hs256)->으로 토큰 검증


        if (req.getMethod().equals("POST")) {
            /* System.out.println("POST요청됨");*/
            String headerAuth = req.getHeader("Authorization");
            System.out.println(headerAuth);
            /*  System.out.println("필터3");*/


            if (headerAuth.equals("calendiary")) {
                chain.doFilter(req, res);//리프레쉬할때 체인필터가 실행이되도록함
            } else {

                PrintWriter out = res.getWriter();
                out.println("no Auth");
            }
        }

    }
}