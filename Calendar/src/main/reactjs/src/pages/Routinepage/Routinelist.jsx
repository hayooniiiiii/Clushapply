import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, Typography, Box, Card, CardContent, Grid, IconButton } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const Routinelist = () => {
    const { date } = useParams();  // URL에서 날짜 가져오기
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);

    // ✅ 루틴 목록 조회
    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/routines?date=${date}`, {
                    withCredentials: true,  // ✅ 쿠키 자동 전송
                });

                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        if (date) {
            fetchRoutines();
        }
    }, [date]);

    // ✅ 루틴 추가 함수
    const handleAddTask = async () => {
        if (task.trim()) {
            const newTask = { routineName: task, routineDate: date };

            try {
                const response = await axios.post("http://localhost:8080/api/routines", newTask, {
                    withCredentials: true,  // ✅ 쿠키 자동 전송
                });

                setTasks((prevTasks) => [...prevTasks, response.data]);
                setTask("");
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
    };

    // ✅ 루틴 삭제 함수
    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/routines/${id}`, {
                withCredentials: true,  // ✅ 쿠키 자동 전송
            });

            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <Box display="flex">
            {/* Sidebar */}
            <Sidebar sx={{ width: 250, flexShrink: 0 }} />

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 3, maxWidth: 600, mx: "auto" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {date} 일정 관리
                </Typography>

                {/* Task Input */}
                <Box display="flex" gap={1} mb={2}>
                    <TextField
                        fullWidth
                        label="새 일정 추가"
                        variant="outlined"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddTask}
                        sx={{ backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}
                    >
                        추가
                    </Button>
                </Box>

                {/* Task List */}
                <Grid container spacing={2}>
                    {tasks.map((item) => (
                        <Grid item xs={12} key={item.id}>
                            <Card>
                                <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography>{item.routineName}</Typography>
                                    <IconButton onClick={() => handleDeleteTask(item.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default Routinelist;
