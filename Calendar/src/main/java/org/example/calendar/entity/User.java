package org.example.calendar.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tb_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(length = 50, nullable = false)
    private String userName;

    @Column(length = 50, nullable = false)
    private String userProvider;

    @Column(length = 50, nullable = false, unique = true)
    private String userProvidId;

    @Column(length = 50, unique = true)
    private String userNickname;

    @Column(length = 500)
    private String userImage;

    @Column(length = 100)
    private String userEmail;

}
