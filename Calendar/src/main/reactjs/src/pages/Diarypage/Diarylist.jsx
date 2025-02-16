import React, { useEffect, useState } from "react";
import { Box, List, ListItem, ListItemText, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";  // ✅ useParams 추가
import Sidebar from "../../components/Sidebar";
import axios from "axios";

const DiaryList = () => {
    const { date } = useParams(); // URL에서 :date 파라미터 값을 가져옴
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                const response = await axios.get(`/api/diaries/list?date=${date}`);
                console.log(response);
                console.log(date);
                setDiaries(response.data);
            } catch (err) {
                setError("다이어리 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        if (date) { // 날짜가 있으면 API 요청
            fetchDiaries();
        }
    }, [date]);

    const handleDiaryClick = (diaryId) => {
        navigate(`/diary/${diaryId}`);
    };

    return (
        <Box display="flex">
            <Sidebar sx={{ width: 250, flexShrink: 0 }} />
            <Box flex={1} p={3} ml={2}>
                {loading && <CircularProgress />}
                {error && <Typography color="error">{error}</Typography>}

                <List sx={{ maxWidth: "800px", margin: "0 auto" }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                        📖 {date}의 다이어리 목록
                    </Typography>
                    {diaries.length === 0 && !loading && <Typography>해당 날짜에 작성된 다이어리가 없습니다.</Typography>}

                    {diaries.map((diary) => (
                        <Card
                            key={diary.id}
                            sx={{ mb: 2, cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                            onClick={() => handleDiaryClick(diary.id)}
                        >
                            <CardContent>
                                <ListItem>
                                    <ListItemText
                                        primary={<Typography variant="h6" sx={{ fontWeight: "bold" }}>{diary.diaryHeader || "제목 없음"}</Typography>}
                                        secondary={`작성 날짜: ${diary.diaryDate}`}
                                    />
                                </ListItem>
                            </CardContent>
                        </Card>
                    ))}
                </List>
            </Box>
        </Box>
    );
};

export default DiaryList;
