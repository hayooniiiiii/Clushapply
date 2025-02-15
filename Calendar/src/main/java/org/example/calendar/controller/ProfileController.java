package org.example.calendar.controller;

import org.example.calendar.model.UserDto;
import org.example.calendar.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * 닉네임 중복 확인 API
     * @param nickname 확인할 닉네임
     * @return 사용 가능 여부 (true: 사용 가능, false: 이미 존재)
     */
    @GetMapping("/check-nickname")
    public ResponseEntity<Map<String, Boolean>> checkNickname(@RequestParam String nickname) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("available", profileService.isNicknameAvailable(nickname));
        return ResponseEntity.ok(response);
    }

    /**
     * 닉네임과 프로필 이미지 저장 API
     * @param userId   사용자 ID
     * @param nickname 사용자 닉네임
     * @param file     프로필 이미지 파일 (선택 사항)
     * @return 저장된 사용자 정보 (UserDto)
     */
    @PostMapping("/save-profile")
    public ResponseEntity<UserDto> saveProfile(
            @RequestParam("userId") int userId,
            @RequestParam("nickname") String nickname,
            @RequestParam(value = "file", required = false) MultipartFile file) {

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
