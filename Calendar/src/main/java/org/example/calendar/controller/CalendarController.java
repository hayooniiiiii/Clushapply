package org.example.calendar.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.calendar.entity.User;
import org.example.calendar.service.CalendarService;
import org.example.calendar.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
@Tag(name = "Calendar API", description = "캘린더 관련 API") // ✅ API 그룹 태그
public class CalendarController {

    private final CalendarService calendarService;
    private final JwtService jwtService;

    // ✅ 특정 월의 다이어리 & 루틴 날짜 목록 반환 (JWT 인증 포함)
    @GetMapping
    @Operation(
            summary = "특정 월의 캘린더 데이터 조회",
            description = "JWT 인증을 통해 특정 사용자의 해당 월 다이어리 및 루틴 날짜 목록을 반환합니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공적으로 데이터를 반환"),
            @ApiResponse(responseCode = "401", description = "JWT 인증 실패"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    public ResponseEntity<Map<String, Object>> getCalendarData(
            @RequestParam
            @Parameter(description = "조회할 월 (yyyy-MM 형식)", example = "2024-02")
            String month,

            HttpServletRequest request) {

        // ✅ JWT에서 사용자 정보 가져오기
        Optional<User> user = jwtService.getUserFromJwt(request);
        if (user.isEmpty()) {
            return ResponseEntity.status(401).build(); // 인증 실패
        }

        // ✅ 해당 월의 다이어리 & 루틴 날짜 가져오기
        List<String> markedDates = calendarService.getMarkedDates(user.get().getUserId(), month);

        // ✅ 응답 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("markedDates", markedDates);
        response.put("month", month);
        response.put("userId", user.get().getUserId());

        return ResponseEntity.ok(response);
    }
}
