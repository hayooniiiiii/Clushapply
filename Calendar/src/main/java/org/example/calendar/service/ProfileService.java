package org.example.calendar.service;

import org.example.calendar.entity.User;
import org.example.calendar.model.UserDto;
import org.example.calendar.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileService {

    // 파일이 저장될 디렉토리
    private static final String UPLOAD_DIR = "uploads/";

    private final UserRepository userRepository;
    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto getUserProfile(User user) {

        return convertToDto(user);
    }

    /**
     * ✅ 사용자 프로필 업데이트
     */
    public UserDto updateProfile(int userId, String nickname, String imageUrl) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }

        User user = optionalUser.get();
        user.setUserNickname(nickname);

        if (imageUrl != null) {
            user.setUserImage(imageUrl);
        }

        userRepository.save(user);

        return UserDto.builder()
                .userId(user.getUserId())
                .userNickname(user.getUserNickname())
                .userImage(user.getUserImage())
                .build();
    }

    /**
     * 닉네임 중복 확인
     * @param nickname 사용자가 입력한 닉네임
     * @return 닉네임 사용 가능 여부 (true: 사용 가능, false: 이미 존재)
     */
    public boolean isNicknameAvailable(String nickname) {
        return userRepository.findByUserNickname(nickname).isEmpty();
    }

    /**
     * 닉네임 & 프로필 이미지 저장
     * @param userDto 클라이언트에서 전달받은 사용자 정보
     * @return 저장된 사용자 DTO
     */
    public UserDto saveProfile(UserDto userDto) {
        Optional<User> optionalUser = userRepository.findById(userDto.getUserId());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setUserNickname(userDto.getUserNickname());

            // 새로운 이미지가 있으면 업데이트
            if (userDto.getUserImage() != null) {
                user.setUserImage(userDto.getUserImage());
            }

            userRepository.save(user); // DB 저장

            return convertToDto(user);
        } else {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
    }

    /**
     * 프로필 이미지 업로드 후 URL 반환
     * @param file 업로드할 이미지 파일
     * @return 저장된 이미지 URL
     */
    public String uploadImage(MultipartFile file) {
        try {
            // 고유한 파일명 생성 (UUID 사용)
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, filename);

            // 폴더가 없으면 생성
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            // 저장된 이미지의 URL 반환
            return "http://localhost:8080/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패", e);
        }
    }

    /**
     * User 엔티티를 UserDto로 변환
     * @param user 저장된 사용자 엔티티
     * @return UserDto 객체
     */
    private UserDto convertToDto(User user) {
        return UserDto.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .userProvider(user.getUserProvider())
                .userProvidId(user.getUserProvidId())
                .userNickname(user.getUserNickname())
                .userImage(user.getUserImage())
                .userEmail(user.getUserEmail())
                .build();
    }
}
