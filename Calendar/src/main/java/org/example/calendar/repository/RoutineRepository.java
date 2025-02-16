package org.example.calendar.repository;

import org.example.calendar.entity.Diary;
import org.example.calendar.entity.Routine;
import org.example.calendar.entity.User;
import org.example.calendar.model.RoutineDto;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, Long> {
    List<Routine> findByUserAndRoutineDate(User user, Date routineDate);

    // ✅ 특정 월(`YYYY-MM`)에 저장된 루틴 날짜 목록 반환
    @Query("SELECT DISTINCT FUNCTION('DATE_FORMAT', r.routineDate, '%Y-%m-%d') " +
            "FROM Routine r WHERE r.user.userId = :userId " +
            "AND FUNCTION('DATE_FORMAT', r.routineDate, '%Y-%m') = :month")
    List<String> findRoutineDatesByMonth(@Param("userId") Integer userId, @Param("month") String month);
}
