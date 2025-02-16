import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Card, CardContent, Typography, CircularProgress, TextField } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DiaryEdit = () => {
    const { id } = useParams();
    const [diary, setDiary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const editorRef = useRef();
    const navigate = useNavigate();

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

    const handleSave = async () => {
        if (!editorRef.current) return;

        const updatedContent = editorRef.current.getInstance().getMarkdown();
        try {
            await axios.put(`/api/diaries/${id}`, {
                diaryHeader: diary.diaryHeader,
                diaryContent: updatedContent,
            }, { withCredentials: true });

            alert("다이어리가 수정되었습니다.");
            navigate(`/diary/${id}`);
        } catch (err) {
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box display="flex">
            <Sidebar sx={{ width: 250, flexShrink: 0 }} />

            <Box flex={1} p={3} ml={2} maxWidth="800px" mx="auto">
                <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
                    <CardContent>
                        <TextField
                            fullWidth
                            label="제목"
                            variant="outlined"
                            value={diary.diaryHeader}
                            onChange={(e) => setDiary({ ...diary, diaryHeader: e.target.value })}
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ border: "1px solid #ddd", borderRadius: 2, p: 2, mt: 2 }}>
                            <Editor ref={editorRef} initialValue={diary.diaryContent} />
                        </Box>

                        <Box mt={3} textAlign="center">
                            <Button variant="contained" color="primary" onClick={() => navigate(`/diary/${id}`)}>
                                취소
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleSave}>
                                저장하기
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default DiaryEdit;
