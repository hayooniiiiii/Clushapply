import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { TextField, Button, Avatar, Grid, Typography, Box } from "@mui/material";

const ProfileEdit = () => {
    const [nickname, setNickname] = useState("");
    const [isNicknameValid, setIsNicknameValid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("/default-profile.png");
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`/api/profile/edit`, { credentials: "include" });
            const data = await response.json();
            setUserId(data.userId);
            setNickname(data.userNickname || "");
            setImagePreview(data.userImage || "/default-profile.png");
        } catch (error) {
            console.error("프로필 정보를 불러오는 중 오류 발생:", error);
        }
    };

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
        setIsNicknameValid(null);
    };

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
            console.error("닉네임 중복 확인 중 오류 발생:", error);
            setIsNicknameValid(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!nickname || isNicknameValid === false) {
            alert("닉네임을 확인해주세요.");
            return;
        }

        if (!userId) {
            alert("유저 정보가 없습니다. 다시 로그인해주세요.");
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
            const response = await fetch(`/api/update-profile`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (response.ok) {
                alert("프로필이 수정되었습니다.");
                navigate("/calendar");
            } else {
                const errorData = await response.json();
                console.error("서버 응답 오류:", errorData);
                alert(`수정 실패: ${errorData.message || "알 수 없는 오류"}`);
            }
        } catch (error) {
            console.error("프로필 수정 오류:", error);
            alert("서버 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    };

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
            <Sidebar />
            <Box sx={{ flex: 1, padding: 3, maxWidth: 500, marginLeft: "240px", textAlign: "center", marginTop: "40px" }}>
                <Typography variant="h5" gutterBottom>프로필</Typography>
                <Box display="flex" justifyContent="center" mb={4} position="relative">
                    <label htmlFor="fileInput" style={{ position: "relative", cursor: "pointer" }}>
                        <Avatar
                            sx={{ width: 150, height: 150, objectFit: "cover", transition: "0.3s", "&:hover": { filter: "brightness(0.7)" } }}
                            src={imagePreview || "default-profile.png"}
                            alt="Profile"
                        />
                    </label>
                    <input type="file" id="fileInput" style={{ display: "none" }} accept="image/*" onChange={handleImageChange} />
                </Box>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={8}>
                        <TextField fullWidth label="닉네임" variant="outlined" value={nickname} onChange={handleNicknameChange} size="small" />
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            variant="contained"
                            onClick={handleNicknameCheck}
                            disabled={loading || !nickname}
                            fullWidth
                            sx={{
                                backgroundColor: !nickname ? "#d6d6d6" : "black",
                                color: "white",
                                "&:hover": { backgroundColor: !nickname ? "#d6d6d6" : "#333" },
                                fontSize: "0.75rem",
                                padding: "10px",
                            }}
                        >
                            {loading ? "확인 중..." : "중복 확인"}
                        </Button>
                    </Grid>
                </Grid>
                {isNicknameValid === false && <Typography color="error" mt={2} variant="body2">중복된 닉네임입니다.</Typography>}
                {isNicknameValid === true && <Typography color="success.main" mt={2} variant="body2">사용 가능한 닉네임입니다!</Typography>}
                <Box mt={3}>
                    <Button variant="contained" onClick={handleSaveProfile} disabled={!isNicknameValid || saving} fullWidth
                            sx={{
                                backgroundColor: isNicknameValid ? "#28a745" : "#d6d6d6",
                                color: "white",
                                "&:hover": { backgroundColor: isNicknameValid ? "#218838" : "#d6d6d6" },
                                fontSize: "0.85rem",
                                padding: "12px",
                            }}>
                        {saving ? "저장 중..." : "저장"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ProfileEdit;
