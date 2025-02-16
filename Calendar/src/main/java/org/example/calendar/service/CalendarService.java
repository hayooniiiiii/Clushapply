package org.example.calendar.service;

import lombok.RequiredArgsConstructor;
import org.example.calendar.repository.DiaryRepository;
import org.example.calendar.repository.RoutineRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final DiaryRepository diaryRepository;
    private final RoutineRepository routineRepository;

    // ✅ 특정 월의 다이어리 & 루틴 날짜 목록 가져오기
    public List<String> getMarkedDates(Integer userId, String month) {
        List<String> diaryDates = diaryRepository.findDiaryDatesByMonth(userId, month);
        List<String> routineDates = routineRepository.findRoutineDatesByMonth(userId, month);

        // ✅ 두 리스트를 합쳐서 중복 제거
        Set<String> markedDates = new HashSet<>(diaryDates);
        markedDates.addAll(routineDates);

        return new ArrayList<>(markedDates);
    }
}
