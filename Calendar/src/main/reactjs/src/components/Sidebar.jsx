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
    const dateFromURL =
        pathSegments[1] === "diarylist" ||
        pathSegments[1] === "saju" ||
        pathSegments[1] === "routinelist"
            ? pathSegments[2]
            : null;

    useEffect(() => {
        console.log("URL-based selectedDate:", dateFromURL);
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

    const handleProfileEdit = () => {
        navigate("/profile-edit");
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
            {/* ✅ 로고 클릭 시 홈으로 이동 */}
            <Typography
                variant="h4"
                sx={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#000",
                    marginBottom: "40px",
                    cursor: "pointer",
                    "&:hover": { color: "#3e2723" },
                }}
                onClick={() => navigate("/")}
            >
                Calendiary
            </Typography>

            {/* ✅ 로그인한 경우 */}
            {user ? (
                <>
                    <img
                        src={imageUrl}
                        alt="프로필"
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            marginBottom: "10px",
                        }}
                        onError={(e) => {
                            e.target.src = "/default-profile.png";
                        }}
                    />
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: "20px",
                            color: "#5d4037",
                            fontWeight: "bold",
                            marginBottom: "10px",
                        }}
                    >
                        {user.userNickname} 님 DIARY
                    </Typography>

                    {/* ✅ 날짜가 있을 경우 다이어리, 일정, 사주 메뉴 표시 */}
                    {dateFromURL && (
                        <>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#3e2723",
                                    marginBottom: "15px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                }}
                                onClick={() => navigate(`/diarylist/${dateFromURL}`)}
                            >
                                📖 {dateFromURL} 다이어리
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#3e2723",
                                    marginBottom: "15px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                }}
                                onClick={() => navigate(`/routinelist/${dateFromURL}`)}
                            >
                                ✅ {dateFromURL} 일정
                            </Typography>

                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#3e2723",
                                    marginBottom: "15px",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                }}
                                onClick={() => navigate(`/saju/${dateFromURL}`)}
                            >
                                🔮 {dateFromURL} 사주
                            </Typography>
                        </>
                    )}

                    {/* ✅ 캘린더 보기 (로그인하면 항상 표시) */}
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
                            "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                        onClick={() => navigate(`/calendar/`)}
                    >
                        📅 캘린더 보기
                    </Typography>

                    {/* ✅ 로그아웃 & 프로필 편집 */}
                    <Stack direction="row" spacing={1} sx={{ marginTop: "10px" }}>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}
                            onClick={handleLogout}
                        >
                            로그아웃
                        </Typography>
                        <Typography variant="body2">|</Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontSize: "14px", cursor: "pointer", textDecoration: "underline" }}
                            onClick={handleProfileEdit}
                        >
                            프로필 편집
                        </Typography>
                    </Stack>
                </>
            ) : (
                <>

                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: "20px",
                            color: "#5d4037",
                            fontWeight: "bold",
                            marginBottom: "10px",
                        }}
                    >
                        소셜 로그인
                    </Typography>
                    <Divider
                        sx={{
                            width: "60%",
                            borderBottomWidth: 2,
                            borderColor: "#5d4037",
                            marginBottom: "20px",
                        }}
                    />

                    <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
                        {["naver", "google", "kakao"].map((provider) => (
                            <Button
                                key={provider}
                                variant="contained"
                                onClick={() =>
                                    (window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`)
                                }
                                sx={{
                                    backgroundColor:
                                        provider === "naver"
                                            ? "#03c75a"
                                            : provider === "google"
                                                ? "#fff"
                                                : "#fee500",
                                    minWidth: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    "&:hover": { opacity: 0.8 },
                                    padding: 0,
                                }}
                            >
                                <img
                                    src={`/socialicon/${provider}.png`}
                                    alt={`${provider} 로그인`}
                                    style={{ width: "30px", height: "30px" }}
                                />
                            </Button>
                        ))}
                    </Stack>

                </>
            )}
        </Box>
    );
}

export default Sidebar;
