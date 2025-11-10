import UseNavi from "../utils/UseNavi";
import Button from "../components/ui/Button";
import requestHandler from "../utils/requestHandler";
import Changehandler from "../utils/Changehandler";
import { useEffect, useState } from "react";
import { useUser } from "../components/context/UserContext";

// 로그인 페이지

const Login = () => {
  const {goIndex, goTo, goBack} = UseNavi();
  const [form, setForm] = useState({
    username:"",
    password:""
  });
  const [loading, setLoading] = useState(true);
  const { user, setUser, isLoggedIn } = useUser();

  useEffect(()=>{
    requestHandler({
      method:"get",
      url:"login/check",
      onSuccess:(data) => {
        if (data.logged_in){
          setUser(data.user);
          
          goIndex();
        }else{
          setLoading(false);
        }
      },
      onError: () => setLoading(false),
    });
  }, [goIndex, setUser]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    requestHandler({
      method: "post",
      url:"login/login",
      credentials: "include",
      payload: form,
      onSuccess:(data) => {
        console.log(data)
        setUser(data.data);

        goIndex();
      },
      onError: (msg) => {
        alert(msg);
      }
    })
  };

  if (loading) return <div>Loading...</div>;

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
