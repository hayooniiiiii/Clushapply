package org.example.calendar.service;

import org.example.calendar.auth.PrincipalDetails;
import org.example.calendar.entity.User;
import org.example.calendar.oauth.KakaoUserInfo;
import org.example.calendar.oauth.GoogleUserInfo;
import org.example.calendar.oauth.NaverUserInfo;
import org.example.calendar.oauth.OAuth2UserInfo;
import org.example.calendar.repository.UserRepository;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public PrincipalOauth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        OAuth2UserInfo oAuth2UserInfo = null;
        if (userRequest.getClientRegistration().getRegistrationId().equals("google")) {
            oAuth2UserInfo = new GoogleUserInfo(oauth2User.getAttributes());
        } else if (userRequest.getClientRegistration().getRegistrationId().equals("naver")) {
            oAuth2UserInfo = new NaverUserInfo((Map<String, Object>) oauth2User.getAttributes().get("response"));
        } else if (userRequest.getClientRegistration().getRegistrationId().equals("kakao")) {
            oAuth2UserInfo = new KakaoUserInfo(oauth2User.getAttributes());
        }

        if (oAuth2UserInfo == null) {
            throw new OAuth2AuthenticationException("OAuth2 Provider not supported");
        }

        String userProvider = oAuth2UserInfo.getProvider();
        String userProviderId = oAuth2UserInfo.getProviderId();
        String userEmail = oAuth2UserInfo.getEmail();
        String userName = oAuth2UserInfo.getName();

        // ✅ 기존 사용자 조회
        Optional<User> optionalUser = userRepository.findByUserEmail(userEmail);
        boolean isFirstLogin = optionalUser.isEmpty();

        User user = optionalUser.orElseGet(() -> {
            System.out.println("OAuth 첫 로그인: 새 사용자 생성");

            User newUser = User.builder()
                    .userName(userName)
                    .userEmail(userEmail)
                    .userProvider(userProvider)
                    .userProvidId(userProviderId)
                    .build();
            return userRepository.save(newUser);
        });

        System.out.println("OAuth 로그인 완료: " + user.getUserEmail());
        System.out.println("최초 로그인 여부: " + isFirstLogin);

        // ✅ PrincipalDetails에 isFirstLogin 추가
        return new PrincipalDetails(user, oauth2User.getAttributes(), isFirstLogin);
    }
}
