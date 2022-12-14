import axios from "axios";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext);

  const logoutHandler = async () => {
    try {
      await axios.patch("/users/logout");
      setMe();
      toast.success("로그아웃!");
    } catch (err) {}
  };

  return (
    <div>
      <Link to="/">
        <span>홈</span>
      </Link>
      {me ? (
        <>
          <span
            onClick={logoutHandler}
            style={{ float: "right", cursor: "pointer" }}
          >
            로그아웃({me.name})
          </span>
        </>
      ) : (
        <>
          <Link to="/auth/login">
            <span style={{ float: "right" }}>로그인</span>
          </Link>
          <Link to="/auth/register">
            <span style={{ float: "right", marginRight: "10px" }}>
              회원가입
            </span>
          </Link>
        </>
      )}
    </div>
  );
};

export default ToolBar;
