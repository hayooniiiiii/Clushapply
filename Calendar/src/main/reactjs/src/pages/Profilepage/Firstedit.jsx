import React, { useState } from "react";
import { Box, Typography, Button, TextField, Avatar } from "@mui/material";

function Firstedit() {
    const [image, setImage] = useState(null);
    const [nickname, setNickname] = useState("");

    // 이미지 업로드 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    // 닉네임 중복 확인 핸들러
    const handleCheckNickname = () => {
        console.log("닉네임 중복 확인:", nickname);
        alert(`"${nickname}" 닉네임 확인 완료!`);
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Box
                sx={{
                    width: "400px",
                    backgroundColor: "white",
                    padding: "24px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* 프로필 이미지 업로드 */}
                <label htmlFor="imageUpload">
                    <Avatar
                        src={image || "/placeholder-image.png"}
                        sx={{
                            width: 100,
                            height: 100,
                            marginBottom: "10px",
                            cursor: "pointer",
                            border: "2px dashed #ddd",
                        }}
                    />
                </label>
                <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                />
                <Typography variant="body2" color="gray">
                    프로필 사진을 업로드하세요
                </Typography>

                {/* 닉네임 입력 및 중복 확인 */}
                <Box sx={{ width: "100%", marginTop: "20px" }}>
                    <TextField
                        fullWidth
                        label="닉네임"
                        variant="outlined"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 2, width: "100%" }}
                        disabled={!nickname}
                        onClick={handleCheckNickname}
                    >
                        중복 확인
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Firstedit;
