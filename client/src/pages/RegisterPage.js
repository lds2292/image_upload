import React, { useState, useContext } from "react";
import CustomInput from "../component/CustomInput";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [, setMe] = useContext(AuthContext);
  const history = useHistory();

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 3)
        throw new Error("회원 ID는 3자리 이상이여야 합니다");
      if (password.length < 6)
        throw new Error("비밀번호는 너무 짧습니다, 6자 이상이여야 합니다");
      if (password !== passwordCheck)
        throw new Error("패스워드를 확인해주세요");

      const result = await axios.post("/users/register", {
        name,
        username,
        password,
      });
      setMe({
        sessionId: result.data.sessionId,
        name: result.data.name,
        userId: result.data.userId,
      });
      toast.success("회원가입 성공");
      history.push("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      style={{
        marginTop: 100,
        maxWidth: 350,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h3>회원가입</h3>
      <form onSubmit={submitHandler}>
        <CustomInput label={"이름"} value={name} setValue={setName} />
        <CustomInput label={"회원ID"} value={username} setValue={setUsername} />
        <CustomInput
          label={"비밀번호"}
          value={password}
          type="password"
          setValue={setPassword}
        />
        <CustomInput
          label={"비밀번호 확인"}
          value={passwordCheck}
          type="password"
          setValue={setPasswordCheck}
        />
        <button style={{ marginTop: 15 }} type="submit">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
