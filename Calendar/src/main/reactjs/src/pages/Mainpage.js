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
                        width: "calc(100vw - 240px)", // 사이드바 제외한 너비
                        minHeight: "300px",
                        backgroundColor: "#fdf0c2", // ✅ 노란 배경 추가
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "0",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        margin: "10",
                        backgroundImage: `url("/banner4.jpg")`, // ✅ 배경 이미지 설정
                        backgroundSize: "contain", // ✅ 아이콘이 잘리지 않도록 설정
                        backgroundPosition: "center", // ✅ 아이콘이 중앙에 위치
                        backgroundRepeat: "no-repeat", // ✅ 반복 방지
                    }}
                >
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
