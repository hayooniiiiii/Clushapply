package org.example.calendar.service;

import org.example.calendar.entity.Routine;
import org.example.calendar.entity.User;
import org.example.calendar.model.RoutineDto;
import org.example.calendar.repository.RoutineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RoutineService {

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    @Autowired
    private RoutineRepository routineRepository;

    /**
     * 특정 사용자 및 날짜에 해당하는 루틴 조회
     */
    public List<Routine> getRoutinesByUserAndDate(User user, String dateString) {
        try {
            Date date = dateFormat.parse(dateString); // ✅ String → Date 변환
            return routineRepository.findByUserAndRoutineDate(user, date);
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format. Expected: yyyy-MM-dd", e);
        }
    }

    /**
     * 루틴 추가 (날짜 변환 적용)
     */
    public Routine createRoutine(RoutineDto routineDto, User user) {
        try {
            Date parsedDate = dateFormat.parse(routineDto.getRoutineDate()); // ✅ 날짜 변환 추가

            Routine routine = new Routine();
            routine.setUser(user);
            routine.setRoutineName(routineDto.getRoutineName());
            routine.setRoutineDate(parsedDate);

            return routineRepository.save(routine);
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format. Expected: yyyy-MM-dd", e);
        }
    }

    /**
     * 루틴 삭제 (본인 소유 루틴만 삭제 가능)
     */
    public boolean deleteRoutine(Long id, User user) {
        Optional<Routine> routine = routineRepository.findById(id);
        if (routine.isPresent() && routine.get().getUser().getUserId()==(user.getUserId())) {
            routineRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
