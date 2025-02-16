import React from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar";

function Mainpage() {
    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                backgroundColor: "#f5f5f5",
                margin: 0,
                padding: 0,
            }}
        >
            {/* 사이드바 */}
            <Sidebar />

            {/* 메인 콘텐츠 (사이드바 오른쪽부터 화면 끝까지 꽉 채우기) */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginLeft: "240px",
                    textAlign: "center",
                    padding: "0", // 패딩 제거해서 공백 없애기
                }}
            >
                {/* 배너 (사이드바 옆부터 창 끝까지 완전히 붙이기) */}
                <Box
                    sx={{
                        width: "calc(100vw - 240px)", // 사이드바 옆부터 창 끝까지 꽉 채움
                        minHeight: "300px",
                        backgroundColor: "#ddd",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "0", // 공백 없이 확장
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        margin: "0", // 공백 제거
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#5d4037",
                            fontWeight: "bold",
                        }}
                    >
                        배너 이미지 영역
                    </Typography>
                </Box>

                {/* 홍보 문구 (조금 아래로 + 왼쪽으로 이동) */}
                <Typography
                    variant="h4"
                    sx={{
                        color: "#000",
                        marginLeft: "30%",
                        marginTop: "50px",
                        opacity: 0.7,
                        fontFamily: "'Song Myung', serif",
                        fontSize: "60px", // 글자 크기 증가
                        lineHeight: "1.5",
                        whiteSpace: "pre-line",
                        padding: "20px",
                        transform: "rotate(-18deg) translate(-0px, 40px)", // 왼쪽(-10px), 아래(20px) 이동
                    }}
                >
                    하루를 기록하는 새로운 습관,{"\n"}Calendiary와 함께!
                </Typography>
            </Box>
        </Box>
    );
}

export default Mainpage;
