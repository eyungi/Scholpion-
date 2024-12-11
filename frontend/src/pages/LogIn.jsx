import * as React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../axiosInstance.jsx";
import {
  TextField,
  Button,
  Grid2,
  Link,
  Typography,
  Container,
  Box, Modal, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from "@mui/material";
import scholpionImage from "../assets/scholpion.png";

function LogIn() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData(e.target);
      console.log();
      const response = await axios.post("/users/token/", {
        email: data.get("email"),
        password: data.get("password"),
      });
      const { access, refresh } = response.data;
      Cookies.set("access_token", access, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
        path: "/",
      });
      Cookies.set("refresh_token", refresh, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
        path: "/",
      });
      navigate("/");
    } catch (error) {
      setOpen(true);
    }
    return false;
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
          <form autoComplete="off" onSubmit={handleLogin}>
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
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Link href="/signup">회원가입</Link>
            </Box>
          </form>
        </Container>
      </Grid2>
      <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
        <DialogTitle id="alert-dialog-title">
          로그인 실패
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            해당 정보로는 로그인할 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Disagree</Button>
        </DialogActions>
      </Dialog>
    </Grid2>
  );
}

export default LogIn;
