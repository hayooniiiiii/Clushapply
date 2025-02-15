import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Box, Typography, Button, Stack, Divider } from "@mui/material";

function Sidebar() {
    const [user, setUser] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

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
                    console.log("Fetched User Data:", data);

                    // userImage 값이 URL이면 그대로 사용
                    if (data.userImage?.startsWith("http")) {
                        setImageUrl(data.userImage);
                    } else {
                        setImageUrl("/default-profile.png"); // 기본 이미지 적용
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
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0",
                borderRight: "1px solid #ddd",
                zIndex: 10,
            }}
        >
            <Typography
                variant="h4"
                sx={{ fontFamily: "'Song Myung', serif", fontSize: "40px", fontWeight: "bold", color: "#000000", marginTop: "30px" }}
            >
                Calendiary
            </Typography>

            {user && (
                <Typography
                    variant="body2"
                    sx={{ fontFamily: "'Song Myung', serif", color: "#3e2723", fontSize: "16px", cursor: "pointer", textDecoration: "underline", marginTop: "20px", marginBottom: "20px" }}
                >
                    친구 목록
                </Typography>
            )}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: "40px",
                    width: "100%",
                }}
            >
                {user ? (
                    <>
                        <img
                            src={imageUrl}
                            alt="프로필"
                            style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px" }}
                            onError={(e) => { e.target.src = "/default-profile.png"; }} // 이미지가 없을 경우 기본 이미지 사용
                        />
                        <Typography
                            variant="body1"
                            sx={{ fontFamily: "'Song Myung', serif", color: "#5d4037", fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}
                        >
                            {user.userNickname} 님 DIARY
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontFamily: "'Song Myung', serif", color: "#b71c1c", fontSize: "14px", fontWeight: "bold", cursor: "pointer", textDecoration: "underline", marginBottom: "10px" }}
                            onClick={handleLogout}
                        >
                            로그아웃
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography
                            variant="body1"
                            sx={{ fontFamily: "'Song Myung', serif", color: "#5d4037", fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}
                        >
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
                                        backgroundColor:
                                            provider === "naver" ? "#03c75a" : provider === "google" ? "#fff" : "#fee500",
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
        </Box>
    );
}

export default Sidebar;
