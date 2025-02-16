import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Box, Typography, Button, Stack, Divider } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
    const [user, setUser] = useState(null);
    const [imageUrl, setImageUrl] = useState("/default-profile.png");
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ URL에서 날짜 추출
    const pathSegments = location.pathname.split("/");
    const dateFromURL = pathSegments[1] === "diarylist" || pathSegments[1] === "saju"  || pathSegments[1] === "routinelist" ? pathSegments[2] : null;

    useEffect(() => {
        console.log("URL-based selectedDate:", dateFromURL); // ✅ URL에서 가져온 날짜 확인
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
            <Typography variant="h4" sx={{ fontSize: "32px", fontWeight: "bold", color: "#000", marginBottom: "40px" }}>
                Calendiary
            </Typography>

            {/* ✅ 로그인한 경우 프로필 정보 표시 */}
            {user ? (
                <>
                    <img
                        src={imageUrl}
                        alt="프로필"
                        style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px" }}
                        onError={(e) => { e.target.src = "/default-profile.png"; }}
                    />
                    <Typography variant="body1" sx={{ fontSize: "20px", color: "#5d4037", fontWeight: "bold", marginBottom: "10px" }}>
                        {user.userNickname} 님 DIARY
                    </Typography>

                    {/* ✅ URL에서 `date`가 있으면 메뉴 추가 */}
                    {dateFromURL && (
                        <>
                            {/* ✅ 다이어리 메뉴 */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#3e2723",
                                    marginBottom: "20px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    transition: "all 0.3s ease-in-out",
                                    backgroundColor: location.pathname.includes("/diarylist")
                                        ? "#e0f2f1"
                                        : "transparent",
                                    boxShadow: location.pathname.includes("/diarylist")
                                        ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                                        : "none",
                                    "&:hover": {
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                        backgroundColor: "#f5f5f5",
                                    },
                                }}
                                onClick={() => navigate(`/diarylist/${dateFromURL}`)}
                            >
                                📖 {dateFromURL} 다이어리
                            </Typography>

                            {/* ✅ 일정  메뉴 */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#3e2723",
                                    marginBottom: "20px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    transition: "all 0.3s ease-in-out",
                                    backgroundColor: location.pathname.includes("/saju")
                                        ? "#e0f2f1"
                                        : "transparent",
                                    boxShadow: location.pathname.includes("/saju")
                                        ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                                        : "none",
                                    "&:hover": {
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                        backgroundColor: "#f5f5f5",
                                    },
                                }}
                                onClick={() => navigate(`/routinelist/${dateFromURL}`)}
                            >
                                ✅ {dateFromURL} 일정
                            </Typography>


                            {/* ✅ 사주 메뉴 */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#3e2723",
                                    marginBottom: "20px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    transition: "all 0.3s ease-in-out",
                                    backgroundColor: location.pathname.includes("/saju")
                                        ? "#e0f2f1"
                                        : "transparent",
                                    boxShadow: location.pathname.includes("/saju")
                                        ? "0px 4px 10px rgba(0, 0, 0, 0.2)"
                                        : "none",
                                    "&:hover": {
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                        backgroundColor: "#f5f5f5",
                                    },
                                }}
                                onClick={() => navigate(`/saju/${dateFromURL}`)}
                            >
                                🔮 {dateFromURL} 사주
                            </Typography>

                            {/* ✅ 캘린더 보기 버튼 */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#3e2723",
                                    marginBottom: "20px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                        backgroundColor: "#f5f5f5",
                                    },
                                }}
                                onClick={() => navigate(`/calendar/`)}
                            >
                                📅 캘린더 보기
                            </Typography>
                        </>
                    )}

                    {/* ✅ 로그아웃 버튼 */}
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: "14px",
                            color: "#b71c1c",
                            fontWeight: "bold",
                            cursor: "pointer",
                            textDecoration: "underline",
                        }}
                        onClick={handleLogout}
                    >
                        로그아웃
                    </Typography>
                </>
            ) : (
                <>
                    {/* ✅ 로그인하지 않은 경우 소셜 로그인 버튼 표시 */}
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
        </Box>
    );
}

export default Sidebar;
