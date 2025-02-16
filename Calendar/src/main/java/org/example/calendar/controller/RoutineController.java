package org.example.calendar.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import org.example.calendar.entity.Routine;
import org.example.calendar.entity.User;
import org.example.calendar.model.RoutineDto;
import org.example.calendar.service.JwtService;
import org.example.calendar.service.RoutineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/routines")
@Tag(name = "Routine API", description = "사용자의 루틴 관리 API") // ✅ API 그룹 태그 추가
public class RoutineController {

    @Autowired
    private RoutineService routineService;

    @Autowired
    private JwtService jwtService;

    /**
     * ✅ 특정 날짜의 루틴 목록 조회 (JWT 인증된 사용자)
     */
    @GetMapping
    @Operation(summary = "특정 날짜의 루틴 조회", description = "JWT 인증을 통해 특정 사용자의 특정 날짜 루틴 목록을 반환합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "루틴 목록 반환"),
            @ApiResponse(responseCode = "401", description = "JWT 인증 실패"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    public ResponseEntity<List<Routine>> getRoutinesByDate(
            @RequestParam("date")
            @Parameter(description = "조회할 날짜 (yyyy-MM-dd 형식)", example = "2024-02-17") String date,

            HttpServletRequest request) {

        Optional<User> user = jwtService.getUserFromJwt(request);
        if (user.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        List<Routine> routines = routineService.getRoutinesByUserAndDate(user.get(), date);
        return ResponseEntity.ok(routines);
    }

    /**
     * ✅ 루틴 추가 (JWT 인증된 사용자)
     */
    @PostMapping
    @Operation(summary = "루틴 추가", description = "JWT 인증을 통해 새로운 루틴을 추가합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "루틴 추가 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "JWT 인증 실패"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    public ResponseEntity<Routine> createRoutine(
            @RequestBody
            @Parameter(description = "추가할 루틴 정보") RoutineDto routineDto,

            HttpServletRequest request) {

        Optional<User> user = jwtService.getUserFromJwt(request);
        if (user.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        try {
            Routine routine = routineService.createRoutine(routineDto, user.get());
            return ResponseEntity.ok(routine);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null); // 날짜 변환 실패 시 400 반환
        }
    }

    /**
     * ✅ 루틴 삭제 (JWT 인증된 사용자)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "루틴 삭제", description = "JWT 인증을 통해 특정 루틴을 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "루틴 삭제 성공"),
            @ApiResponse(responseCode = "401", description = "JWT 인증 실패"),
            @ApiResponse(responseCode = "403", description = "삭제 권한 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    public ResponseEntity<Void> deleteRoutine(
            @PathVariable
            @Parameter(description = "삭제할 루틴 ID", example = "1") Long id,

            HttpServletRequest request) {

        Optional<User> user = jwtService.getUserFromJwt(request);
        if (user.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        boolean isDeleted = routineService.deleteRoutine(id, user.get());
        if (!isDeleted) {
            return ResponseEntity.status(403).build(); // 권한 없음
        }
        return ResponseEntity.noContent().build();
    }
}
