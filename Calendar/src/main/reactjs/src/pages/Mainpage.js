import React from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar";


function Mainpage() {
    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                backgroundColor: "#f5f5f5", // 전체 배경색
                margin: 0,
                padding: 0,
            }}
        >
            {/* Sidebar 컴포넌트 추가 */}
            <Sidebar />

            {/* 배너 및 홍보 문구 섹션 */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    padding: 0, // 패딩 제거
                    position: "relative", // 홍보 문구 위치 설정을 위한 부모 요소
                }}
            >
                {/* 배너 이미지 */}
                <Box
                    sx={{
                        width: "100%",
                        height: "50%",
                        backgroundColor: "#ddd",
                        borderRadius: "0px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px", // 배너 위치
                        marginBottom: 0, // 간격 제거
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#5d4037",
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        배너 이미지 영역
                    </Typography>
                </Box>

                {/* 홍보 텍스트 */}
                <Typography
                    variant="h5"
                    sx={{
                        position: "absolute", // 위치를 고정
                        bottom: "100px", // 화면의 아래에서 100px 위에 고정
                        right: "50px", // 화면의 오른쪽에서 50px 안쪽에 고정
                        transform: "rotate(-20deg)", // 기울기 유지
                        color: "#000",
                        opacity: 0.6,
                        fontFamily: "'Song Myung', serif",
                        fontSize: "45px",
                        lineHeight: "1.5",
                        textAlign: "center", // 텍스트 중앙 정렬
                        whiteSpace: "pre-line", // 줄바꿈 강제 적용
                    }}
                >
                    하루를 기록하는 새로운 습관,{"\n"}
                    Calendiary와 함께!
                </Typography>
            </Box>
        </Box>
    );
}

export default Mainpage;
