import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const nav = useNavigate();
  return (
    <div>
      <Button onClick={() => nav("./../login")}>Log In</Button>
      <Button onClick={() => nav("./../signup")}>회원가입</Button>
    </div>
  );
};

export default Home;
