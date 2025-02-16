package org.example.calendar.controller;

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
public class RoutineController {

    @Autowired
    private RoutineService routineService;

    @Autowired
    private JwtService jwtService;

    /**
     * 특정 날짜의 루틴 목록 조회 (JWT 인증된 사용자)
     */
    @GetMapping
    public ResponseEntity<List<Routine>> getRoutinesByDate(@RequestParam("date") String date, HttpServletRequest request) {
        Optional<User> user = jwtService.getUserFromJwt(request);
        if (user.isEmpty()) {
            return ResponseEntity.status(401).build();
        }
        List<Routine> routines = routineService.getRoutinesByUserAndDate(user.get(), date);
        return ResponseEntity.ok(routines);
    }

    /**
     * 루틴 추가 (JWT 인증된 사용자)
     */
    @PostMapping
    public ResponseEntity<Routine> createRoutine(@RequestBody RoutineDto routineDto, HttpServletRequest request) {
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
     * 루틴 삭제 (JWT 인증된 사용자)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoutine(@PathVariable Long id, HttpServletRequest request) {
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
