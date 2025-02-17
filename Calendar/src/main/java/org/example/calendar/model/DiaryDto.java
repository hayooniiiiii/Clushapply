package org.example.calendar.model;

import lombok.*;
import org.w3c.dom.Text;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiaryDto {
    private Long id; //다이어리기본키
    private LocalDate diaryDate;//다이어리 저장 날짜
    private String diaryHeader;//다이어리헤더
    private Long userId;//만든 사람id
    private String diaryContent; // JSON 형태로 저장되는 다이어리 내용
    private LocalDateTime diaryTime; //다이어리 저장 시간

}
