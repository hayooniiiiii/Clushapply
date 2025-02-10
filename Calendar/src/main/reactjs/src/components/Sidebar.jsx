import React from "react";
import { Box, Typography, Button, Stack, Divider } from "@mui/material";

function Sidebar() {
    return (
        <Box
            sx={{
                width: "20%",
                backgroundColor: "#f9f4ec",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0", // padding 제거
                borderRight: "1px solid #ddd",
                height: "100vh", // 전체 화면 높이 적용
            }}
        >
            {/* 로고 */}
            <Typography
                variant="h4"
                sx={{
                    fontFamily: "'PT Serif', serif",
                    fontSize: "40px",
                    fontWeight: "bold",
                    color: "#000000",
                    marginTop: "30px",
                }}
            >
                Calendiary
            </Typography>

            {/* 소셜 로그인 섹션 */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: "40px",
                    width: "100%",
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontFamily: "'Montserrat',serif",
                        color: "#5d4037",
                        fontSize: "20px",
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
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {/* 네이버 로그인 버튼 */}
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#03c75a",
                            minWidth: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            "&:hover": { backgroundColor: "#028f3e" },
                            padding: 0, // 이미지 맞추기 위해 padding 제거
                        }}
                    >
                        <img
                            src="/socialicon/naver.png"
                            alt="네이버 로그인"
                            style={{ width: "30px", height: "30px" }}
                        />
                    </Button>

                    {/* 구글 로그인 버튼 */}
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#fff",
                            minWidth: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            "&:hover": { backgroundColor: "#f0f0f0" },
                            padding: 0,
                        }}
                    >
                        <img
                            src="/socialicon/google.png"
                            alt="구글 로그인"
                            style={{ width: "30px", height: "30px" }}
                        />
                    </Button>

                    {/* 카카오 로그인 버튼 */}
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#fee500",
                            minWidth: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            "&:hover": { backgroundColor: "#fada0d" },
                            padding: 0,
                        }}
                    >
                        <img
                            src="/socialicon/kakao.png"
                            alt="카카오 로그인"
                            style={{ width: "30px", height: "30px" }}
                        />
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}

export default Sidebar;
