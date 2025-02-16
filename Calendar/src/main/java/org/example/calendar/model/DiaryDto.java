package org.example.calendar.model;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiaryDto {
    private Long id; //다이어리기본키
    private LocalDate diaryDate;//다이어리 저장 날짜
    private Long userId;//만든 사람id
    private Map<String, Object> diaryContent; // JSON 형태로 저장되는 다이어리 내용
    private LocalDateTime diaryTime; //다이어리 저장 시간
    private Long diaryEdit; //다이어리 누가 편집중인건지?
    private Long diaryEditor; //다이어리 지금 편집중인 사람 id
}
