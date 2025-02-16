import React, { useState } from "react";
import { TextField, Button, CircularProgress, Typography, Box, Card, CardContent, Grid } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { getTodaySaju } from "../../components/gpt";

const Saju = ({ isCalendarMode, selectedDate }) => {
    const [birthDate, setBirthDate] = useState("");
    const [birthTime, setBirthTime] = useState("");
    const [sajuResult, setSajuResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSajuCheck = async () => {
        if (!birthDate || !birthTime) {
            setError("생년월일과 출생 시간을 모두 입력해주세요.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const result = await getTodaySaju({ birthDate, birthTime });
            if (result) {
                setSajuResult(result);
            } else {
                setError("사주 데이터를 가져오는 데 실패했습니다.");
            }
        } catch (err) {
            setError("사주 조회 중 오류 발생: " + err.message);
        }
        setLoading(false);
    };

    return (
        <Box display="flex">
            {/* Sidebar */}
            <Sidebar isCalendarMode={isCalendarMode} selectedDate={selectedDate} sx={{ width: 250, flexShrink: 0 }} />

            {/* Main Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, ml: 30 }}> {/* Sidebar와 겹치지 않도록 마진 추가 */}
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    🔮 오늘의 사주 보기
                </Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="생년월일 (YYYY-MM-DD)"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="출생 시간 (HH:MM)"
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={birthTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="center">
                        <Button
                            variant="contained"
                            sx={{ bgcolor: "black", color: "white", fontWeight: "bold", px: 4, py: 1.5 }}
                            onClick={handleSajuCheck}
                        >
                            사주 보기
                        </Button>
                    </Grid>
                </Grid>

                {loading && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Typography color="error" mt={2} textAlign="center">
                        {error}
                    </Typography>
                )}

                {sajuResult && (
                    <Card sx={{ mt: 4, p: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                📜 오늘의 사주 결과
                            </Typography>
                            <Typography variant="body1">{sajuResult}</Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Box>
    );
};

export default Saju;
