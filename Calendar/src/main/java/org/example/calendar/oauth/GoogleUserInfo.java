package org.example.calendar.oauth;

import java.util.Map;

public class GoogleUserInfo implements OAuth2UserInfo{

    private Map<String,Object> attributes;//get attributes를 받는다.

    public GoogleUserInfo(Map<String,Object> attributes) {
        this.attributes=attributes;
    }

    @Override
    public String getProviderId() {
        // TODO Auto-generated method stub
        return (String) attributes.get("sub");
    }

    @Override
    public String getProvider() {
        // TODO Auto-generated method stub
        return "google";
    }

    @Override
    public String getEmail() {
        // TODO Auto-generated method stub
        return (String) attributes.get("email");
    }

    @Override
    public String getName() {
        // TODO Auto-generated method stub
        return (String) attributes.get("name");
    }

}