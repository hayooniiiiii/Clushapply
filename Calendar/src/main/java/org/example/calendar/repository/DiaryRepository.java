package org.example.calendar.repository;

import org.example.calendar.entity.Diary;
import org.example.calendar.model.DiaryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    // ✅ 특정 날짜의 다이어리 목록 가져오기
    List<Diary> findByUser_UserIdAndDiaryDate(Integer userId, LocalDate diaryDate);

    // 특정 다이어리 ID로 조회
    Optional<Diary> findById(Long id);


    // ✅ 특정 월(`YYYY-MM`)에 작성된 다이어리 날짜 목록 반환
    @Query("SELECT DISTINCT FUNCTION('DATE_FORMAT', d.diaryDate, '%Y-%m-%d') " +
            "FROM Diary d WHERE d.user.userId = :userId " +
            "AND FUNCTION('DATE_FORMAT', d.diaryDate, '%Y-%m') = :month")
    List<String> findDiaryDatesByMonth(@Param("userId") Integer userId, @Param("month") String month);

}