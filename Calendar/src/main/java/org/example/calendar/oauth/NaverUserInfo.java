package org.example.calendar.oauth;

import java.util.Map;

public class NaverUserInfo implements OAuth2UserInfo{

    private Map<String,Object> attributes;//get attributes를 받는다.

    public NaverUserInfo(Map<String,Object> attributes) {
        this.attributes=attributes;
    }


    @Override
    public String getProviderId() {
        // TODO Auto-generated method stub
        return (String) attributes.get("id");
    }

    @Override
    public String getProvider() {
        // TODO Auto-generated method stub
        return "naver";
    }

    @Override
    public String getEmail() {
        return (String) attributes.get("email");
    }

    @Override
    public String getName() {
        // TODO Auto-generated method stub
        return (String) attributes.get("name");
    }

}