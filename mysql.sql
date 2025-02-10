-- 1. 데이터베이스 생성
CREATE DATABASE calendardb;

-- 2. 데이터베이스 사용
USE calendardb;

-- 3. 사용자 테이블 (tb_user)
CREATE TABLE tb_user (
    userId BIGINT AUTO_INCREMENT PRIMARY KEY,    -- 사용자 기본키
    userName VARCHAR(50) NOT NULL,               -- 사용자 이름
    userProvider VARCHAR(50),                    -- 소셜경로
    userProvidId VARCHAR(50),                    -- 소셜 ID
    userNickname VARCHAR(50),                    -- 사용자 닉네임
    userImage VARCHAR(200)                       -- 사용자 이미지
);

-- 4. 친구 테이블 (tb_friend)
CREATE TABLE tb_friend (
    friendId BIGINT AUTO_INCREMENT PRIMARY KEY,  -- 친구 기본키
    userId BIGINT NOT NULL,                      -- 친구를 요청한 사용자 ID
    ownerId BIGINT NOT NULL                      -- 친구 요청을 받은 사용자 ID
);

-- 5. 다이어리 테이블 (tb_diary)
CREATE TABLE tb_diary (
    diaryId BIGINT AUTO_INCREMENT PRIMARY KEY,   -- 다이어리 기본키
    diaryDate DATE,                              -- 다이어리 날짜
    userId BIGINT NOT NULL,                      -- 작성자 ID
    diaryContent JSON,                           -- 다이어리 내용 (JSON)
    diaryTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 다이어리 저장 시간
    diaryEdit BIGINT NOT NULL DEFAULT 0,         -- 편집 중 상태 (0: 가능, 1: 편집 중)
    diaryEditor BIGINT DEFAULT NULL              -- 현재 편집 중인 사용자 ID
);

-- 6. 공유 다이어리 테이블 (tb_share)
CREATE TABLE tb_share (
    shareId BIGINT AUTO_INCREMENT PRIMARY KEY,   -- 공유 기본키
    diaryId BIGINT NOT NULL,                     -- 공유된 다이어리 ID
    userId BIGINT NOT NULL                       -- 공유받은 사용자 ID
);

-- 외래 키 추가
ALTER TABLE tb_friend ADD FOREIGN KEY (userId) REFERENCES tb_user(userId) ON DELETE CASCADE;
ALTER TABLE tb_friend ADD FOREIGN KEY (ownerId) REFERENCES tb_user(userId) ON DELETE CASCADE;

ALTER TABLE tb_diary ADD FOREIGN KEY (userId) REFERENCES tb_user(userId) ON DELETE CASCADE;

ALTER TABLE tb_share ADD FOREIGN KEY (diaryId) REFERENCES tb_diary(diaryId) ON DELETE CASCADE;
ALTER TABLE tb_share ADD FOREIGN KEY (userId) REFERENCES tb_user(userId) ON DELETE CASCADE;
