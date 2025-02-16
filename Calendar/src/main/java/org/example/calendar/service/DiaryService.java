package org.example.calendar.service;

import lombok.RequiredArgsConstructor;
import org.example.calendar.entity.Diary;
import org.example.calendar.entity.User;
import org.example.calendar.model.DiaryDto;
import org.example.calendar.repository.DiaryRepository;
import org.example.calendar.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    @Transactional
    public void saveDiary(Integer userId, DiaryDto diaryDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Diary diary = Diary.builder()
                .user(user)
                .diaryDate(diaryDto.getDiaryDate())
                .diaryHeader(diaryDto.getDiaryHeader())
                .diaryContent(diaryDto.getDiaryContent())
                .diaryEdit(0L)
                .diaryEditor(null)
                .build();

        diaryRepository.save(diary);
    }

    // ✅ 특정 날짜의 다이어리 조회 기능 추가
    public List<DiaryDto> getDiariesByUserAndDate(Integer userId, LocalDate date) {
        List<Diary> diaries = diaryRepository.findByUser_UserIdAndDiaryDate(userId, date);

        return diaries.stream().map(diary -> DiaryDto.builder()
                .id(diary.getId())
                .diaryDate(diary.getDiaryDate())
                .diaryHeader(diary.getDiaryHeader())
                .diaryContent(diary.getDiaryContent())
                .diaryTime(diary.getDiaryTime())
                .diaryEdit(diary.getDiaryEdit())
                .diaryEditor(diary.getDiaryEditor())
                .build()).collect(Collectors.toList());
    }


    // 특정 다이어리 가져오기
    public DiaryDto getDiaryById(Long diaryId, Integer userId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary not found"));

        // 본인의 다이어리만 조회 가능 (Objects.equals 사용)
        if (!Objects.equals(diary.getUser().getUserId(), userId)) {
            throw new IllegalArgumentException("Unauthorized access");
        }


        return DiaryDto.builder()
                .id(diary.getId())
                .diaryDate(diary.getDiaryDate())
                .diaryHeader(diary.getDiaryHeader())
                .diaryContent(diary.getDiaryContent())
                .diaryTime(diary.getDiaryTime())
                .diaryEdit(diary.getDiaryEdit())
                .diaryEditor(diary.getDiaryEditor())
                .build();
    }


    // ✅ 다이어리 업데이트 기능 추가
    @Transactional
    public void updateDiary(Long diaryId, Integer userId, DiaryDto diaryDto) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new IllegalArgumentException("Diary not found"));

        if (!Objects.equals(diary.getUser().getUserId(), userId)) {
            throw new IllegalArgumentException("Unauthorized access");
        }

        diary.setDiaryHeader(diaryDto.getDiaryHeader());
        diary.setDiaryContent(diaryDto.getDiaryContent());
        diary.setDiaryDate( LocalDate.now());


        diaryRepository.save(diary);
    }
}