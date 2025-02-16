import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Box, Typography, Button, Stack, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar({ showExtraItems, isCalendarMode }) {
    const [user, setUser] = useState(null);
    const [imageUrl, setImageUrl] = useState("/default-profile.png");
    const [selectedMenu, setSelectedMenu] = useState("오늘의 일정"); // 기본값: 오늘의 일정
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedDate } = location.state || {};

    useEffect(() => {
        const jwtToken = Cookies.get("jwtToken");
        if (jwtToken) {
            const fetchUser = async () => {
                try {
                    const response = await fetch("http://localhost:8080/api/user", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });

                    if (response.status === 204) {
                        setUser(null);
                        return;
                    }

                    const data = await response.json();
                    if (data.userImage?.startsWith("http")) {
                        setImageUrl(data.userImage);
                    }

                    setUser(data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                    setUser(null);
                }
            };
            fetchUser();
        }
    }, []);

    // 날짜를 클릭할 때 기본으로 "오늘의 일정" 선택되도록 설정
    useEffect(() => {
        if (selectedDate) {
            setSelectedMenu("오늘의 일정");
        }
    }, [selectedDate]);

    const handleLogout = () => {
        Cookies.remove("jwtToken");
        setUser(null);
        window.location.reload();
    };

    return (
        <Box
            sx={{
                position: "fixed",
                left: 0,
                top: 0,
                width: "240px",
                height: "100vh",
                backgroundColor: "#f9f4ec",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 0",
                borderRight: "1px solid #ddd",
                fontFamily: "'Song Myung', serif",
            }}
        >
            {/* 헤더 (로고) */}
            <Typography variant="h4" sx={{ fontSize: "32px", fontWeight: "bold", color: "#000", marginBottom: "40px" }}>
                Calendiary
            </Typography>

            {/* 로그인하지 않은 경우: 소셜 로그인 버튼 표시 */}
            {!user && (
                <>
                    <Typography variant="body1" sx={{ fontSize: "20px", color: "#5d4037", fontWeight: "bold", marginBottom: "10px" }}>
                        소셜 로그인
                    </Typography>
                    <Divider sx={{ width: "60%", borderBottomWidth: 2, borderColor: "#5d4037", marginBottom: "20px" }} />

                    <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
                        {["naver", "google", "kakao"].map((provider) => (
                            <Button
                                key={provider}
                                variant="contained"
                                onClick={() => (window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`)}
                                sx={{
                                    backgroundColor: provider === "naver" ? "#03c75a" : provider === "google" ? "#fff" : "#fee500",
                                    minWidth: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    "&:hover": { opacity: 0.8 },
                                    padding: 0,
                                }}
                            >
                                <img src={`/socialicon/${provider}.png`} alt={`${provider} 로그인`} style={{ width: "30px", height: "30px" }} />
                            </Button>
                        ))}
                    </Stack>
                </>
            )}

            {/* 로그인한 경우: 프로필 정보 및 메뉴 표시 */}
            {user && (
                <>
                    <img
                        src={imageUrl}
                        alt="프로필"
                        style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px" }}
                        onError={(e) => { e.target.src = "/default-profile.png"; }} // 기본 이미지 적용
                    />
                    <Typography variant="body1" sx={{ fontSize: "20px", color: "#5d4037", fontWeight: "bold", marginBottom: "10px" }}>
                        {user.userNickname} 님 DIARY
                    </Typography>

                    {/* 달력에서 날짜를 선택한 경우 메뉴 표시 */}
                    {(showExtraItems || isCalendarMode) && (
                        <>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: selectedMenu === "오늘의 일정" ? "#b71c1c" : "#3e2723",
                                    marginBottom: "20px",
                                    transition: "all 0.3s",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    '&:hover': { textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)" }
                                }}
                                onClick={() => setSelectedMenu("오늘의 일정")}
                            >
                                오늘의 일정
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: selectedMenu === "오늘의 다이어리" ? "#b71c1c" : "#3e2723",
                                    marginBottom: "20px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    '&:hover': { textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)" }
                                }}
                                onClick={() => setSelectedMenu("오늘의 다이어리")}
                            >
                                오늘의 다이어리
                            </Typography>
                        </>
                    )}

                    {/* 나의 캘린더 (순서 변경: 나의 캘린더 → 친구 목록) */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#3e2723",
                            marginBottom: "20px",
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.3s",
                            '&:hover': { textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)" }
                        }}
                        onClick={() => navigate("/calendar")} // 클릭하면 캘린더로 이동
                    >
                        나의 캘린더
                    </Typography>

                    {/* 친구 목록 (나의 캘린더 아래로 이동) */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#3e2723",
                            marginBottom: "20px",
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.3s",
                            '&:hover': { textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)" }
                        }}
                    >
                        친구 목록
                    </Typography>

                    {/* 로그아웃 버튼 */}
                    <Typography
                        variant="body2"
                        sx={{ fontSize: "14px", color: "#b71c1c", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}
                        onClick={handleLogout}
                    >
                        로그아웃
                    </Typography>
                </>
            )}
        </Box>
    );
}

export default Sidebar;
