package org.example.calendar.model;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShareDto {
    private Long id;
    private Long diaryId;
    private Long userId;

}
