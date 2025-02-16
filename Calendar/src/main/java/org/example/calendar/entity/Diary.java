package org.example.calendar.entity;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.*;
import org.hibernate.type.SqlTypes;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "tb_diary")
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diaryId", nullable = false)
    private Long id;

    @Column(name = "diaryDate")
    private LocalDate diaryDate;


    @Column(name = "diaryHeader")
    private String diaryHeader;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @Column(name = "diaryContent", columnDefinition = "TEXT")
    private String diaryContent;


    @CreationTimestamp
    @Column(name = "diary_time", nullable = false, updatable = false)
    private LocalDateTime diaryTime;


    @ColumnDefault("0")
    @Column(name = "diaryEdit", nullable = false)
    private Long diaryEdit;

    @Column(name = "diaryEditor")
    private Long diaryEditor;

}