package org.example.calendar.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.calendar.model.DiaryDto;
import org.example.calendar.service.DiaryService;
import org.example.calendar.entity.User;
import org.example.calendar.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/diaries")
@RequiredArgsConstructor
public class DiaryController {
    private final DiaryService diaryService;
    private final JwtService jwtService;

    // 다이어리 저장
    @PostMapping("/save")
    public ResponseEntity<String> saveDiary(@RequestBody DiaryDto diaryDto, HttpServletRequest request) {
        User user = jwtService.getUserFromJwt(request)
                .orElseThrow(() -> new IllegalArgumentException("Unauthorized"));

        diaryService.saveDiary(user.getUserId(), diaryDto);
        return ResponseEntity.ok("다이어리가 저장되었습니다.");
    }

    // ✅ 특정 날짜의 다이어리 조회 API 추가
    @GetMapping("/list")
    public ResponseEntity<List<DiaryDto>> getUserDiaries(
            @RequestParam(required = false) String date, // ✅ 날짜를 쿼리 파라미터로 받음
            HttpServletRequest request) {

        User user = jwtService.getUserFromJwt(request)
                .orElseThrow(() -> new IllegalArgumentException("Unauthorized"));

        List<DiaryDto> diaries;

        if (date != null && !date.isEmpty()) {
            diaries = diaryService.getDiariesByUserAndDate(user.getUserId(), LocalDate.parse(date)); // ✅ 특정 날짜 다이어리 조회
        } else{
            diaries=List.of();
        }

        return ResponseEntity.ok(diaries);
    }

    //diary가지고오기
    @GetMapping("/{diaryId}")
    public ResponseEntity<DiaryDto> getDiary(@PathVariable Long diaryId, HttpServletRequest request) {
        User user = jwtService.getUserFromJwt(request)
                .orElseThrow(() -> new IllegalArgumentException("Unauthorized"));


        DiaryDto diary = diaryService.getDiaryById(diaryId, user.getUserId());

        System.out.println(diary);
        return ResponseEntity.ok(diary);
    }

    // ✅ 다이어리 업데이트 API 추가
    @PutMapping("/{diaryId}")
    public ResponseEntity<String> updateDiary(@PathVariable Long diaryId, @RequestBody DiaryDto diaryDto, HttpServletRequest request) {
        User user = jwtService.getUserFromJwt(request)
                .orElseThrow(() -> new IllegalArgumentException("Unauthorized"));

        diaryService.updateDiary(diaryId, user.getUserId(), diaryDto);
        return ResponseEntity.ok("다이어리가 업데이트되었습니다.");
    }
}
