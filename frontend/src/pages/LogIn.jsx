import {
  TextField,
  Button,
  Grid2,
  Link,
  Typography,
  Container,
} from "@mui/material";

import scholpionImage from "../assets/scholpion.png";

function LogIn() {
  return (
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
          mt: 8,
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
            autoFocus
            sx={{ mb: 2 }}
          />
          <br />
          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            name="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            로그인
          </Button>
          <Grid2 container spacing={2}>
            <Grid2 size="grow">
              <Link href="../forgotpwd">비밀번호 찾기</Link>
            </Grid2>
            <Grid2 item>
              <Link href="../signup">회원가입</Link>
            </Grid2>
          </Grid2>
        </Container>
      </Grid2>
    </Grid2>
  );
}

export default LogIn;
