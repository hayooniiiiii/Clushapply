import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, isSameMonth, isSameDay, subMonths, addMonths } from "date-fns";
import Sidebar from "../../components/Sidebar";
import PushPinIcon from '@mui/icons-material/PushPin'; // 📌 핀 아이콘 추가

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("UserId");
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [markedDates, setMarkedDates] = useState({}); // 📌 다이어리 있는 날짜 저장

    useEffect(() => {
        if (userId) {
            axios.get(`/api/user/${userId}`)
                .then((response) => {
                    setUserInfo(response.data);
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

    useEffect(() => {
        axios.get(`/api/calendar?month=${format(currentDate, "yyyy-MM")}`, {
            withCredentials: true, // ✅ 인증 정보(쿠키, 토큰) 포함하여 요청
        })
            .then((response) => {
                console.log("📌 Fetched diary data:", response.data); // ✅ API 응답 확인

                if (response.data && response.data.markedDates) {
                    const diaryMap = {};
                    response.data.markedDates.forEach(date => {
                        const formattedDate = format(new Date(date), "yyyy-MM-dd");
                        diaryMap[formattedDate] = true;
                    });
                    setMarkedDates(diaryMap);
                    console.log("📌 Processed markedDates:", diaryMap); // ✅ 상태 확인
                }
            })
            .catch((error) => {
                console.error("❌ Error fetching diary data:", error);
            });
    }, [currentDate]);

    const startDate = startOfWeek(startOfMonth(currentDate));
    const endDate = endOfWeek(endOfMonth(currentDate));

    const days = [];
    let day = startDate;
    while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
    }

    const handleDateClick = (date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        console.log("Clicked Date:", formattedDate);
        setSelectedDate(formattedDate);
        navigate(`/diarylist/${formattedDate}`);
    };

    const handleMonthChange = (change) => {
        setCurrentDate(change === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    };

    const handleYearChange = (event) => {
        const newYear = event.target.value;
        setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
    };

    return (
        <Box display="flex" height="100vh">
            <Sidebar selectedDate={selectedDate} />

            <Box flex={1} display="flex" flexDirection="column" alignItems="center" p={3}>
                <Typography variant="h4" gutterBottom>
                    My Diary Calendar
                </Typography>

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
                                    {days.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, index) => {
                                        const formattedDate = format(day, "yyyy-MM-dd");
                                        return (
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
                                                    position: "relative"
                                                }}
                                                onClick={() => handleDateClick(day)}
                                            >
                                                <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                                    {format(day, "d")}
                                                    {markedDates[formattedDate] && (
                                                        <PushPinIcon sx={{ fontSize: "2rem", color: "#ff5722" }} />
                                                    )}
                                                </Box>
                                            </TableCell>
                                        );
                                    })}
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
