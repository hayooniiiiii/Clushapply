package org.example.calendar.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShareDto {
    private Long shareId; // 공유 ID
    private Long diaryId; // 공유된 다이어리 ID
    private int userId; // 공유된 사용자 ID
    private Boolean shareStatus; // 현재 편집 중인지 여부
    private LocalDateTime shareTime; // 편집 시작 시간
}