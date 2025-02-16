import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DiaryLook = () => {
    const { id } = useParams();
    const [diary, setDiary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 다이어리 데이터 불러오기
    useEffect(() => {
        const fetchDiary = async () => {
            try {
                const response = await axios.get(`/api/diaries/${id}`, {
                    withCredentials: true,
                });
                setDiary(response.data);
            } catch (err) {
                setError("다이어리를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchDiary();
    }, [id]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box display="flex">
            <Sidebar sx={{ width: 250, flexShrink: 0 }} />

            <Box flex={1} p={3} ml={2} maxWidth="800px" mx="auto">
                <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                            {diary.diaryHeader || "제목 없음"}
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary">
                            작성 날짜: {diary.diaryDate}
                        </Typography>


                        <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2, mt: 2 }}>
                            <Viewer initialValue={diary.diaryContent} />
                        </Box>

                        <Box mt={3} textAlign="center">
                            <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                                뒤로 가기
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => navigate(`/diary/edit/${id}`)}>
                                편집하기
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default DiaryLook;
