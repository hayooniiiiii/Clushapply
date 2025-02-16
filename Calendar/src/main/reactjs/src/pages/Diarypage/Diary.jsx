import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import axios from "axios";

const Diary = () => {
    const location = useLocation();
    const { isCalendarMode, selectedDate } = location.state || {};
    const editorRef = useRef(null);
    const [title, setTitle] = useState("");

    // 다이어리 저장
    const saveDiary = async () => {
        if (!editorRef.current) return;

        const content = editorRef.current.getInstance().getMarkdown();

        try {
            await axios.post("/api/diaries/save", {
                userId: 1,
                diaryDate: selectedDate || new Date().toISOString().split("T")[0],
                diaryTitle: title,
                diaryContent: content,
            });
            alert("다이어리가 저장되었습니다!");
        } catch (error) {
            console.error("다이어리 저장 실패:", error);
        }
    };

    return (
        <Box display="flex">
            <Sidebar isCalendarMode={isCalendarMode} selectedDate={selectedDate} sx={{ width: 250, flexShrink: 0 }} />
            <Box flex={1} p={3} ml={2}>
                {/* 제목 입력 필드 */}
                <Typography
                    component="h2"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => setTitle(e.target.innerText)}
                    sx={{
                        mb: 2,
                        fontSize: "2rem",
                        fontWeight: "bold",
                        outline: "none",
                        borderBottom: "1px solid #ddd",
                        paddingBottom: "8px",
                        maxWidth: "800px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "block",
                        cursor: "text",
                        color: "gray"
                    }}
                >
                    {title || "제목을 입력해주세요..."}
                </Typography>

                {/* Toast UI Editor */}
                <Box border="1px solid #ddd" borderRadius="8px" p={2} minHeight="400px" bgcolor="#f9f9f9" sx={{ marginLeft: "auto", marginRight: "auto", maxWidth: "800px" }}>
                    <Editor
                        ref={editorRef}
                        initialValue="여기에 다이어리를 작성하세요..."
                        previewStyle="tab"
                        height="500px"
                        initialEditType="markdown"
                        useCommandShortcut={true}
                    />
                </Box>

                {/* 저장 버튼 */}
                <Button variant="contained" color="primary" sx={{ mt: 2, display: "block", marginLeft: "auto", marginRight: "auto" }} onClick={saveDiary}>
                    저장하기
                </Button>
            </Box>
        </Box>
    );
};

export default Diary;
