package org.example.calendar.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoutineDto {
    private Long routineId;
    private Long userId;
    private String routineName;
    private String routineDate;  // ✅ String으로 수정
}
