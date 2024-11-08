import {
  TextField,
  Button,
  Grid2,
  Link,
  Typography,
  Container,
} from "@mui/material";
import { useState } from "react";
import scholpionImage from "../assets/scholpion.png";
import { useNavigate } from "react-router-dom";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePwd = (e) => {
    setPassword(e.target.value);
  };

  const mockLoginApi = async (email, password) => {
    if (email === "dldbsrl@scholpion.com" && password === "1234") {
      return {
        token: "fake-jwt-token",
        user: { email, firstName: "윤기", secondName: "이" },
      };
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const handleLogin = async () => {
    const response = await mockLoginApi(email, password);
    sessionStorage.setItem("token", response.token);
    sessionStorage.setItem("user", JSON.stringify(response.user));
    nav("/");
  };

  document.body.style.overflow = "hidden";
  return (
    <Grid2 container spacing={2} sx={{ height: "100vh" }}>
      <Grid2 size={5.5} sx={{ height: "100vh" }}>
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
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="xs">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              mb: 1,
            }}
          >
            로그인
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            align="left"
            sx={{ mb: 2 }}
          >
            시작하기 위해 로그인을 해주세요
          </Typography>
          <TextField
            label="Email Address"
            required
            fullWidth
            name="email"
            value={email}
            onChange={onChangeEmail}
            autoFocus
            sx={{ mb: 2 }}
          />
          <br />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={onChangePwd}
            required
            fullWidth
            name="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleLogin}
            sx={{ mt: 3, mb: 2 }}
          >
            로그인
          </Button>
          <Grid2 container spacing={2}>
            <Grid2 size="grow">
              <Link href="../forgotpwd">비밀번호 찾기</Link>
            </Grid2>
            <Grid2>
              <Link href="../signup">회원가입</Link>
            </Grid2>
          </Grid2>
        </Container>
      </Grid2>
    </Grid2>
  );
}

export default LogIn;
