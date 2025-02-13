package org.example.calendar.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private int userId;
    private String userName;
    private String userProvider;
    private String userProvidId;
    private String userNickname;
    private String userImage;
    private String userEmail;
}