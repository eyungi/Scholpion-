import {
    Typography,
    Button,
    Checkbox,
    FormControlLabel,
    Link,
    TextField,
    Container,
    Stack,
    Grid2, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog,
} from "@mui/material";
import scholpionImage from "../assets/scholpion.png";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {createUser} from "../apis/auth.js";
import * as React from "react";

const SignUp = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogText, setDialogText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (formData.get("password1") !== formData.get("password2")) {
            setDialogText("비밀번호가 일치하지 않습니다.");
            setDialogOpen(true);
            return false;
        }

        const password = formData.get("password1");
        formData.delete("password1");
        formData.delete("password2");

        const payload = {};
        for (const [k, v] of formData.entries()) {
            payload[k] = v;
        }
        try {
            await createUser({
                ...payload,
                password,
                role,
            });
            navigate("/login");
        } catch (error) {
            let msg = "";
            Object.entries(error.response.data).forEach(([k, v]) => msg += `${k} : ${v.reduce((acc, cur) => acc + cur + " ", "")}\n<br/>`);
            setDialogText(msg);
            setDialogOpen(true);
            return false;
        }
        return false;
    };

    document.body.style.overflow = "hidden";
    return (
        <div>
            <Grid2 container spacing={2}>
                <Grid2 size={5.5}>
                    <img
                        src={scholpionImage}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                        alt={"Logo"}
                    />
                </Grid2>
                <Grid2
                    size={6.5}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                    }}
                >
                    <Container maxWidth="xs">
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{
                                width: "100%",
                                fontSize: "clamp(1.8rem, 8vw, 2rem)",
                                mb: 1,
                            }}
                        >
                            회원가입
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            align="left"
                            sx={{mb: 0.5}}
                        >
                            시작하기 위해 로그인을 해주세요
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{mb: 0.5}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={role === "학생"}
                                        onChange={() => setRole("학생")}
                                        value="학생"
                                    />
                                }
                                label="학생"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={role === "선생님"}
                                        onChange={() => setRole("선생님")}
                                        value="선생님"
                                    />
                                }
                                label="선생님"
                            />
                        </Stack>
                        {role && (
                            <form onSubmit={handleSubmit}>
                                <Stack spacing={1}>
                                    <TextField
                                        label="이름"
                                        name="name"
                                        required
                                        fullWidth
                                        autoFocus
                                        placeholder="HongGildong"
                                    />
                                    <TextField
                                        label="이메일"
                                        name="email"
                                        required
                                        fullWidth
                                        placeholder="scholpion@email.com"
                                        variant="outlined"
                                    />
                                    {role === "학생" && (
                                        <Stack spacing={1}>
                                            <TextField
                                                label="학교"
                                                name="school"
                                                required
                                                fullWidth
                                                placeholder="서강고등학교"
                                            />
                                            <TextField
                                                label="학년"
                                                name="grade"
                                                required
                                                fullWidth
                                                placeholder="고3"
                                            />
                                        </Stack>
                                    )}
                                    {role === "선생님" && (
                                        <Stack spacing={1}>
                                            <TextField
                                                label="기관"
                                                name="institution"
                                                required
                                                fullWidth
                                                placeholder="서강고등학교"
                                            />
                                            <TextField
                                                label="과목"
                                                name="subject"
                                                required
                                                fullWidth
                                                placeholder="영어"
                                            />
                                        </Stack>
                                    )}
                                    <TextField
                                        label="비밀번호"
                                        required
                                        fullWidth
                                        name="password1"
                                        placeholder="••••••"
                                        type="password"
                                        variant="outlined"
                                    />
                                    <TextField
                                        label="비밀번호 확인"
                                        required
                                        fullWidth
                                        name="password2"
                                        placeholder="••••••"
                                        type="password"
                                        variant="outlined"
                                    />
                                </Stack>
                                <FormControlLabel
                                    control={<Checkbox value="allow" color="primary"/>}
                                    label="페이지 정책에 동의합니다"
                                    sx={{mt: 0.3}}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 1}}
                                >
                                    회원가입
                                </Button>
                            </form>
                        )}
                        <Typography sx={{textAlign: "center", mt: 1}}>
                            이미 계정을 가지고 있습니까?{" "}
                            <span>
                <Link
                    href="/login"
                    variant="body2"
                    sx={{alignSelf: "center"}}
                >
                  로그인
                </Link>
              </span>
                        </Typography>
                    </Container>
                </Grid2>
            </Grid2>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle id="alert-dialog-title">
                    회원가입 실패
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div dangerouslySetInnerHTML={{ __html: dialogText }}></div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SignUp;
