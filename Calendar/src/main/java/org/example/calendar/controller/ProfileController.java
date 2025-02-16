package org.example.calendar.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.example.calendar.model.UserDto;
import org.example.calendar.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Profile API", description = "사용자 프로필 관련 API") // ✅ API 그룹 태그 추가
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * ✅ 닉네임 중복 확인 API
     */
    @GetMapping("/check-nickname")
    @Operation(summary = "닉네임 중복 확인", description = "입력한 닉네임이 사용 가능한지 확인합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "닉네임 사용 가능 여부 반환"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    public ResponseEntity<Map<String, Boolean>> checkNickname(
            @RequestParam
            @Parameter(description = "확인할 닉네임", example = "john_doe") String nickname) {

        Map<String, Boolean> response = new HashMap<>();
        response.put("available", profileService.isNicknameAvailable(nickname));
        return ResponseEntity.ok(response);
    }

    /**
     * ✅ 닉네임과 프로필 이미지 저장 API
     */
    @PostMapping("/save-profile")
    @Operation(summary = "닉네임과 프로필 이미지 저장", description = "사용자의 닉네임과 선택적으로 프로필 이미지를 저장합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "프로필 저장 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<UserDto> saveProfile(
            @RequestParam("userId")
            @Parameter(description = "사용자 ID", example = "123") int userId,

            @RequestParam("nickname")
            @Parameter(description = "사용자 닉네임", example = "john_doe") String nickname,

            @RequestParam(value = "file", required = false)
            @Parameter(description = "프로필 이미지 파일 (선택 사항)") MultipartFile file) {

        String imageUrl = null;

        // 이미지 파일이 존재하면 업로드 후 URL 반환
        if (file != null && !file.isEmpty()) {
            imageUrl = profileService.uploadImage(file);
        }

        // UserDto 객체 생성하여 서비스에 전달
        UserDto userDto = UserDto.builder()
                .userId(userId)
                .userNickname(nickname)
                .userImage(imageUrl) // 이미지 URL이 있으면 저장, 없으면 null
                .build();

        // 닉네임 및 이미지 저장
        UserDto savedUser = profileService.saveProfile(userDto);
        return ResponseEntity.ok(savedUser);
    }
}
