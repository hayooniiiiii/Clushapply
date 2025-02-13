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
    private Long id;
    private LocalDate diaryDate;
    private Long userId;
    private Map<String, Object> diaryContent;
    private LocalDateTime diaryTime;
    private Long diaryEdit;
    private Long diaryEditor;
}
