import UseNavi from "../utils/UseNavi";
import Button from "../components/ui/Button";
import requestHandler from "../utils/requestHandler";
import Changehandler from "../utils/Changehandler";
import { useState } from "react";

// 로그인 페이지

const Login = () => {
  const {goIndex, goTo, goBack} = UseNavi();
  const [form, setForm] = useState({
    username:"",
    password:""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    requestHandler({
      method: "post",
      url:"auth/login",
      payload: form,
      setLoading,
      onSuccess:(data) => {
        console.log(data);

        goIndex();
      },
      onError: (msg) => {
        alert(msg)
      }
    })
  };

  return (
    <>
      <div className="wrapper">
        <h2>로그인 페이지</h2>

        <form action="">

          <div>
            <h4>아이디</h4>
            <input type="text" name="username" value={form.username} onChange={Changehandler(setForm)} />
          </div>

          <div>
            <h4>비밀번호</h4>
            <input type="password" name="password" value={form.password} onChange={Changehandler(setForm)} />
          </div>

          <Button variant="primary" onClick={handleSubmit}>로그인</Button>

        </form>

      </div>
    </>
  );
}

export default Login;
