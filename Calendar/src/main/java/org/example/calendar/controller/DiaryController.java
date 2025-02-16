package org.example.calendar.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@Tag(name = "Diary API", description = "다이어리 관련 API") // ✅ API 그룹 태그 추가
public class DiaryController {
    private final DiaryService diaryService;
    private final JwtService jwtService;

    // ✅ 다이어리 저장 API
    @PostMapping("/save")
    @Operation(summary = "다이어리 저장", description = "사용자가 새로운 다이어리를 저장합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "다이어리 저장 성공"),
            @ApiResponse(responseCode = "401", description = "JWT 인증 실패")
    })
    public ResponseEntity<String> saveDiary(
            @RequestBody
            @Parameter(description = "저장할 다이어리 데이터") DiaryDto diaryDto,

            HttpServletRequest request) {

        User user = jwtService.getUserFromJwt(request)
                .orElseThrow(() -> new IllegalArgumentException("Unauthorized"));

        diaryService.saveDiary(user.getUserId(), diaryDto);
        return ResponseEntity.ok("다이어리가 저장되었습니다.");
    }

    // ✅ 특정 날짜의 다이어리 조회 API
    @GetMapping("/list")
    @Operation(summary = "특정 날짜의 다이어리 조회", description = "사용자의 특정 날짜에 작성한 다이어리를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "다이어리 목록 반환"),
            @ApiResponse(responseCode = "401", description = "JWT 인증 실패")
    })
    public ResponseEntity<List<DiaryDto>> getUserDiaries(
            @RequestParam(required = false)
            @Parameter(description = "조회할 날짜 (yyyy-MM-dd 형식)", example = "2024-02-17") String date,

            HttpServletRequest request) {

        User user = jwtService.getUserFromJwt(request)
                .orElseThrow(() -> new IllegalArgumentException("Unauthorized"));

        List<DiaryDto> diaries;

        if (date != null && !date.isEmpty()) {
            diaries = diaryService.getDiariesByUserAndDate(user.getUserId(), LocalDate.parse(date)); // ✅ 특정 날짜 다이어리 조회
        } else {
            diaries = List.of();
        }

        return ResponseEntity.ok(diaries);
    }

    // ✅ 다이어리 개별 조회 API
    @GetMapping("/{diaryId}")
    @Operation(summary = "다이어리 상세 조회", description = "특정 다이어리를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "다이어리 반환"),
            @ApiResponse(responseCode = "401", description = "JWT 인증 실패"),
            @ApiResponse(responseCode = "404", description = "다이어리를 찾을 수 없음")
    })
    public ResponseEntity<DiaryDto> getDiary(
            @PathVariable
            @Parameter(description = "조회할 다이어리 ID", example = "1") Long diaryId,

            HttpServletRequest request) {

        User user = jwtService.getUserFromJwt(request)
                .orElseThrow(() -> new IllegalArgumentException("Unauthorized"));

        DiaryDto diary = diaryService.getDiaryById(diaryId, user.getUserId());

        return ResponseEntity.ok(diary);
    }

    // ✅ 다이어리 업데이트 API
    @PutMapping("/{diaryId}")
    @Operation(summary = "다이어리 수정", description = "사용자가 기존에 저장한 다이어리를 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "다이어리 수정 성공"),
            @ApiResponse(responseCode = "401", description = "JWT 인증 실패"),
            @ApiResponse(responseCode = "404", description = "다이어리를 찾을 수 없음")
    })
    public ResponseEntity<String> updateDiary(
            @PathVariable
            @Parameter(description = "수정할 다이어리 ID", example = "1") Long diaryId,

            @RequestBody
            @Parameter(description = "수정할 다이어리 데이터") DiaryDto diaryDto,

            HttpServletRequest request) {

        User user = jwtService.getUserFromJwt(request)
                .orElseThrow(() -> new IllegalArgumentException("Unauthorized"));

        diaryService.updateDiary(diaryId, user.getUserId(), diaryDto);
        return ResponseEntity.ok("다이어리가 업데이트되었습니다.");
    }
}
