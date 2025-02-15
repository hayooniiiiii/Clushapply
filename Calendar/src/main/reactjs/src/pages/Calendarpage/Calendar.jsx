import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    MenuItem,
    Select,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    addDays,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    format,
    isSameMonth,
    isSameDay,
    subMonths,
    addMonths,
} from "date-fns";
import Sidebar from "../../components/Sidebar";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("UserId"); // URL에서 UserId 가져오기
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetch(`/api/user/${userId}`)
                .then((response) => response.json())
                .then((data) => {
                    setUserInfo(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [userId]);

    // 해당 월의 첫 번째 & 마지막 날짜 가져오기
    const startDate = startOfWeek(startOfMonth(currentDate));
    const endDate = endOfWeek(endOfMonth(currentDate));

    // 날짜 목록 생성
    const days = [];
    let day = startDate;
    while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
    }

    // 날짜 클릭 시 이동
    const handleDateClick = (date) => {
        navigate(`/diary/${format(date, "yyyy-MM-dd")}`);
    };

    // 월 변경 핸들러
    const handleMonthChange = (change) => {
        setCurrentDate(change === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    };

    // 년도 변경 핸들러
    const handleYearChange = (event) => {
        const newYear = event.target.value;
        setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
    };

    return (
        <Box display="flex" height="100vh">
            <Sidebar userInfo={userInfo} /> {/* ✅ 사용자 정보 props로 전달 */}

            <Box flex={1} display="flex" flexDirection="column" alignItems="center" p={3}>
                <Typography variant="h4" gutterBottom>
                    My Diary Calendar
                </Typography>

                {/* 년도 & 월 선택 드롭다운 */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Select value={currentDate.getFullYear()} onChange={handleYearChange}>
                        {[...Array(11)].map((_, index) => {
                            const year = new Date().getFullYear() - 5 + index;
                            return (
                                <MenuItem key={year} value={year}>
                                    {year}년
                                </MenuItem>
                            );
                        })}
                    </Select>

                    <Typography variant="h6">{format(currentDate, "MMMM yyyy")}</Typography>

                    <Box display="flex" gap={1}>
                        <Typography
                            onClick={() => handleMonthChange("prev")}
                            sx={{ cursor: "pointer", fontSize: "1.2rem", fontWeight: "bold", color: "#007BFF" }}
                        >
                            ◀
                        </Typography>
                        <Typography
                            onClick={() => handleMonthChange("next")}
                            sx={{ cursor: "pointer", fontSize: "1.2rem", fontWeight: "bold", color: "#007BFF" }}
                        >
                            ▶
                        </Typography>
                    </Box>
                </Box>

                {/* 캘린더 테이블 */}
                <TableContainer component={Paper} sx={{ maxWidth: 1000, marginTop: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                    <TableCell key={day} align="center" sx={{ fontWeight: "bold", bgcolor: "#f0f0f0", fontSize: "1.1rem" }}>
                                        {day}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...Array(Math.ceil(days.length / 7))].map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {days.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, index) => (
                                        <TableCell
                                            key={index}
                                            align="center"
                                            sx={{
                                                padding: "15px",
                                                cursor: "pointer",
                                                fontSize: "1.2rem",
                                                bgcolor: isSameMonth(day, currentDate) ? "white" : "#f8f8f8",
                                                fontWeight: isSameDay(day, new Date()) ? "bold" : "normal",
                                                color: isSameDay(day, new Date()) ? "#ff5722" : "black",
                                                border: "1px solid #ddd",
                                                borderRadius: "8px",
                                                "&:hover": { bgcolor: "#e0f7fa" },
                                            }}
                                            onClick={() => handleDateClick(day)}
                                        >
                                            {format(day, "d")}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Calendar;
