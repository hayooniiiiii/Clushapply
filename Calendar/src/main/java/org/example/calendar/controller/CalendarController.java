package org.example.calendar.controller;

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
public class CalendarController {

    private final CalendarService calendarService;
    private final JwtService jwtService;

    // ✅ 특정 월의 다이어리 & 루틴 날짜 목록 반환 (JWT 인증 포함)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getCalendarData(
            @RequestParam String month,
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
