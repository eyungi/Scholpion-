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

const SignUp = () => {
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
            minHeight: "100vh", // 화면 높이의 100%로 설정
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
              sx={{ mb: 2 }}
            >
              시작하기 위해 로그인을 해주세요
            </Typography>
            <Stack spacing={1}>
              <TextField
                label="이메일"
                name="email"
                required
                fullWidth
                placeholder="scholpion@email.com"
                variant="outlined"
              />
              <TextField
                label="비밀번호"
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                variant="outlined"
              />
              <TextField
                label="비밀번호 확인"
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                variant="outlined"
              />
              <TextField
                label="성"
                name="secondName"
                required
                fullWidth
                autoFocus
                placeholder="Hong"
              />
              <TextField
                label="이름"
                name="firstNmae"
                required
                fullWidth
                placeholder="Gildong"
              />
            </Stack>
            <FormControlLabel
              control={<Checkbox value="allow" color="primary" />}
              label="페이지 정책에 동의합니다"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              회원가입
            </Button>
            <Typography sx={{ textAlign: "center", mt: 2 }}>
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
