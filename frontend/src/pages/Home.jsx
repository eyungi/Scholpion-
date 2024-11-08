import {
  Button,
  Box,
  Container,
  Avatar,
  ClickAwayListener,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import scholpionImage from "../assets/scholpion.png";
import tryTest from "../assets/tryTest.png";
import checkGrade from "../assets/checkGrade.png";
import logout from "../assets/logout.png";
import profile from "../assets/profile.png";

const Home = () => {
  const nav = useNavigate();
  const [myPageOpen, setMyPageOpen] = useState(false);
  const [isToken, setIsToken] = useState(false);

  const handleTooltipClose = () => {
    setMyPageOpen(false);
  };
  const handleTooltipOpen = () => {
    setMyPageOpen(true);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      nav("/login");
    } else {
      setIsToken(true);
      nav("/", { replac: true });
    }
  });

  if (isToken === false) return <div>loading...</div>;

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userFirstName = user.firstName;
  const userSecondName = user.secondName;

  const userEmail = user.email;

  const onClickName = () => {
    console.log("이름 클릭함");
  };

  const onClickLogout = () => {
    sessionStorage.clear();
    nav("/login");
  };
  console.log(userFirstName);
  console.log(userSecondName);
  console.log(userEmail);

  document.body.style.overflow = "hidden";
  return (
    <div>
      <Container maxWidth="md">
        <header
          style={{
            justifyContent: "space-between",
            display: "flex",
            padding: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex" }}>
            <Avatar src={scholpionImage} />
            <div style={{ padding: "6px" }}>스콜피온</div>
          </div>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
              open={myPageOpen}
              componentsProps={{
                tooltip: { sx: { bgcolor: "white", color: "black" } },
              }}
              title={
                <Box>
                  <Box
                    sx={{ p: 1, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)" }}
                  >
                    학생
                  </Box>
                  <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
                    <img
                      src={profile}
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "5px",
                      }}
                    ></img>
                    프로필
                  </Box>
                  <Box
                    onClick={onClickLogout}
                    sx={{
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={logout}
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "5px",
                      }}
                    ></img>
                    로그아웃
                  </Box>
                </Box>
              }
            >
              <div
                onClick={handleTooltipOpen}
                style={{ display: "flex", cursor: "pointer" }}
              >
                <Avatar>{userSecondName}</Avatar>
                <div style={{ padding: "6px" }}>
                  {userSecondName + userFirstName}
                </div>
              </div>
            </Tooltip>
          </ClickAwayListener>
        </header>
        <Container
          sx={{
            marginTop: "200px",
          }}
        >
          <h2>
            안녕하세요
            <br />
            오늘도 열심히 공부해볼까요?
          </h2>
          <Button
            color="gray"
            variant="contained"
            style={{
              minWidth: "200px",
              minHeight: "100px",
              fontSize: "24px",
              backgroundColor: "#d3d3d3",
              marginRight: "10px",
            }}
          >
            <img
              src={tryTest}
              style={{ width: "40px", height: "40px", margin: "2px" }}
            />
            시험 응시
          </Button>
          <Button
            color="gray"
            variant="contained"
            style={{
              minWidth: "200px",
              minHeight: "100px",
              fontSize: "24px",
              backgroundColor: "#d3d3d3",
            }}
          >
            <img
              src={checkGrade}
              style={{ width: "40px", height: "40px", margin: "2px" }}
            />
            결과 확인
          </Button>
        </Container>
      </Container>
    </div>
  );
};

export default Home;
