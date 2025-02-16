package org.example.calendar.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import org.example.calendar.entity.User;
import org.example.calendar.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@Tag(name = "User API", description = "사용자 정보 관련 API") // ✅ API 그룹 태그 추가
public class UserController {

    @Autowired
    private JwtService jwtService;

    /**
     * ✅ JWT 토큰을 사용하여 사용자 정보를 반환하는 엔드포인트
     */
    @GetMapping("/user")
    @Operation(summary = "사용자 정보 조회", description = "JWT 인증을 통해 현재 로그인한 사용자의 정보를 반환합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "사용자 정보 반환 성공"),
            @ApiResponse(responseCode = "401", description = "JWT 인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류 발생")
    })
    public ResponseEntity<?> getUserInfo(
            @Parameter(description = "JWT가 포함된 요청 객체") HttpServletRequest request) {

        Optional<User> user = jwtService.getUserFromJwt(request);

        if (user.isPresent()) {
            User userData = user.get();
            Map<String, Object> response = new HashMap<>();
            response.put("userId", userData.getUserId());
            response.put("userName", userData.getUserName());
            response.put("userNickname", userData.getUserNickname());
            response.put("userEmail", userData.getUserEmail());

            // ✅ 1️⃣ userImage가 `http://` URL이면 변환 없이 그대로 사용
            if (userData.getUserImage() != null && userData.getUserImage().startsWith("http")) {
                response.put("userImage", userData.getUserImage());
                return ResponseEntity.ok(response);
            }

            // ✅ 2️⃣ userImage가 `blob:` URL이면 경고 메시지 포함해서 반환
            if (userData.getUserImage() != null && userData.getUserImage().startsWith("blob:")) {
                response.put("userImage", null);
                response.put("error", "Blob URL cannot be used directly. Please update the image to a file URL or Base64.");
                return ResponseEntity.ok(response); // 사용자 정보는 유지하면서 에러 메시지 포함
            }

            // ✅ 3️⃣ userImage가 `BLOB(byte[])` 데이터일 경우 Base64 변환
            if (userData.getUserImage() != null && !userData.getUserImage().isEmpty()) {
                try {
                    byte[] imageBytes = userData.getUserImage().getBytes(); // BLOB 데이터 가져오기
                    String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
                    response.put("userImage", base64Image);
                } catch (Exception e) {
                    e.printStackTrace();
                    response.put("userImage", null);
                    response.put("error", "Failed to process image.");
                }
            } else {
                // ✅ 4️⃣ userImage가 null이면 기본 이미지 URL 제공
                response.put("userImage", "http://localhost:8080/uploads/default-profile.png");
            }

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(404).body("{\"message\": \"User not found\"}");
        }
    }
}
