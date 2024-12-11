import {
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
  Container,
  Stack,
  Grid2,
} from "@mui/material";
import scholpionImage from "../assets/scholpion.png";
import { useState } from "react";
import axios from "../axiosInstance.jsx";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const nav = useNavigate();
  const [role, setRole] = useState("");
  const [checkPwd, setCheckPwd] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "/users/register/",
        {
          ...formData,
          role,
        }
      );
      console.log(response.data);
      nav("/login");
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
    }
  };

  const handlePwdSame = (e) => {
    setCheckPwd(formData.password !== e.target.value);
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
              sx={{ mb: 0.5 }}
            >
              시작하기 위해 로그인을 해주세요
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
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
              <>
                {role === "학생" && (
                  <Stack spacing={1}>
                    <TextField
                      label="이름"
                      name="name"
                      required
                      fullWidth
                      autoFocus
                      placeholder="HongGildong"
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="이메일"
                      name="email"
                      required
                      fullWidth
                      placeholder="scholpion@email.com"
                      variant="outlined"
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="학교"
                      name="school"
                      required
                      fullWidth
                      placeholder="서강고등학교"
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="학년"
                      name="grade"
                      required
                      fullWidth
                      placeholder="고3"
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="비밀번호"
                      required
                      fullWidth
                      name="password"
                      placeholder="••••••"
                      type="password"
                      variant="outlined"
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="비밀번호 확인"
                      required
                      fullWidth
                      name="checkpassword"
                      placeholder="••••••"
                      type="password"
                      variant="outlined"
                      onChange={handlePwdSame}
                      helperText={
                        checkPwd ? "비밀번호가 일치하지 않습니다." : ""
                      }
                    />
                  </Stack>
                )}
                {role === "선생님" && (
                  <Stack spacing={1}>
                    <TextField
                      label="이름"
                      name="name"
                      required
                      fullWidth
                      autoFocus
                      placeholder="HongGildong"
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="이메일"
                      name="email"
                      required
                      fullWidth
                      placeholder="scholpion@email.com"
                      variant="outlined"
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="기관"
                      name="institution"
                      required
                      fullWidth
                      placeholder="서강고등학교"
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="과목"
                      name="subject"
                      required
                      fullWidth
                      placeholder="영어"
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="비밀번호"
                      required
                      fullWidth
                      name="password"
                      placeholder="••••••"
                      type="password"
                      variant="outlined"
                      onChange={handleInputChange}
                    />
                    <TextField
                      label="비밀번호 확인"
                      required
                      fullWidth
                      name="checkpassword"
                      placeholder="••••••"
                      type="password"
                      variant="outlined"
                      onChange={handlePwdSame}
                      helperText={
                        checkPwd ? "비밀번호가 일치하지 않습니다." : ""
                      }
                    />
                  </Stack>
                )}
                <FormControlLabel
                  control={<Checkbox value="allow" color="primary" />}
                  label="페이지 정책에 동의합니다"
                  sx={{ mt: 0.3 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={handleSubmit}
                >
                  회원가입
                </Button>
              </>
            )}
            <Typography sx={{ textAlign: "center", mt: 1 }}>
              이미 계정을 가지고 있습니까?{" "}
              <span>
                <Link
                  href="../login/"
                  variant="body2"
                  sx={{ alignSelf: "center" }}
                >
                  로그인
                </Link>
              </span>
            </Typography>
          </Container>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default SignUp;
