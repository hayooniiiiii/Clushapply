import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { TextField, Button, Avatar, Grid, Typography, Box } from "@mui/material";

const Profile = () => {
    const [nickname, setNickname] = useState("");
    const [isNicknameValid, setIsNicknameValid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState(null);

    const location = useLocation();

    // 🔹 URL에서 userId 추출
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const idFromUrl = params.get("UserId");
        setUserId(idFromUrl);
    }, [location]);

    // 🔹 닉네임 입력 시 상태 업데이트
    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
        setIsNicknameValid(null);
    };

    // 🔹 닉네임 중복 확인 요청
    const handleNicknameCheck = async () => {
        if (!nickname) {
            alert("닉네임을 입력해주세요");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`/api/check-nickname?nickname=${nickname}`);
            const data = await response.json();
            setIsNicknameValid(data.available);
        } catch (error) {
            console.error("닉네임 확인 중 오류 발생:", error);
            setIsNicknameValid(null);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 프로필 저장 (닉네임 + 이미지 업로드)
    const handleSaveProfile = async () => {
        if (!nickname || isNicknameValid === false) {
            alert("닉네임을 확인해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("nickname", nickname);

        if (imageFile) {
            formData.append("file", imageFile);
        }

        setSaving(true);
        try {
            const response = await fetch(`/api/save-profile`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("프로필이 저장되었습니다.");
            } else {
                alert("저장 실패.");
            }
        } catch (error) {
            console.error("프로필 저장 오류:", error);
        } finally {
            setSaving(false);
        }
    };

    // 🔹 이미지 파일 선택 시 미리보기 설정
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    return (
        <Box display="flex">
            {/* 사이드바 */}
            <Sidebar />

            {/* 메인 컨텐츠 */}
            <Box sx={{ flex: 1, padding: 3, maxWidth: 500, marginLeft: "240px", textAlign: "center", marginTop: "40px" }}>
                <Typography variant="h5" gutterBottom>프로필</Typography>

                {/* 프로필 이미지 */}
                <Box display="flex" justifyContent="center" mb={4}>
                    <label htmlFor="fileInput">
                        <Avatar
                            sx={{
                                width: 150,
                                height: 150,
                                cursor: "pointer",
                                objectFit: "cover",
                            }}
                            src={imagePreview || "default-profile.png"} // 기존 이미지 or 기본 이미지
                            alt="Profile"
                        />
                    </label>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </Box>

                {/* 닉네임 입력 및 중복 확인 버튼 */}
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            label="닉네임"
                            variant="outlined"
                            value={nickname}
                            onChange={handleNicknameChange}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            onClick={handleNicknameCheck}
                            disabled={loading}
                            fullWidth
                            sx={{
                                backgroundColor: "black",
                                color: "white",
                                "&:hover": { backgroundColor: "#333" },
                                fontSize: "0.75rem",
                                padding: "10px",
                            }}
                        >
                            {loading ? "확인 중..." : "중복 확인"}
                        </Button>
                    </Grid>
                </Grid>

                {/* 닉네임 중복 여부 메시지 */}
                {isNicknameValid === false && (
                    <Typography color="error" mt={2} variant="body2">
                        중복된 닉네임입니다.
                    </Typography>
                )}
                {isNicknameValid === true && (
                    <Typography color="success.main" mt={2} variant="body2">
                        사용 가능한 닉네임입니다!
                    </Typography>
                )}

                {/* 프로필 저장 버튼 */}
                <Box mt={3}>
                    <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        disabled={!isNicknameValid || saving}
                        fullWidth
                        sx={{
                            backgroundColor: isNicknameValid ? "#28a745" : "#d6d6d6",
                            color: "white",
                            "&:hover": { backgroundColor: isNicknameValid ? "#218838" : "#d6d6d6" },
                            fontSize: "0.85rem",
                            padding: "12px",
                        }}
                    >
                        {saving ? "저장 중..." : "저장"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Profile;
