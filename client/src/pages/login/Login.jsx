import "./login.scss";
import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../context/Context";
import { userRequest } from "../../requestMethods";

const Login = () => {
  useEffect(() => {
    document.title = "Đăng nhập - Quản lý KTX.";
  }, []);

  const userRef = useRef();
  const passwordRef = useRef();
  const { dispatch, isFetching } = useContext(Context);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await userRequest.post("/auth/login", {
        username: userRef.current.value,
        password: passwordRef.current.value,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE" });
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  };

  return (
    <div className="login">
      <h2 className="login__title">Đăng nhập</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <label htmlFor="">Tên người dùng</label>
        <input
          className="login__input"
          type="text"
          placeholder="Tên người dùng"
          ref={userRef}
        />
        <label htmlFor="">Mật khẩu</label>
        <input
          className="login__input"
          type="password"
          placeholder="Mật khẩu"
          ref={passwordRef}
        />
        <button className="login__button" type="submit" disabled={isFetching}>
          Đăng nhập
        </button>
      </form>
      <div className="login__link">
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </div>
      {error && (
        <span className="login__error">
          Tên người dùng hoặc mật khẩu chưa đúng!
        </span>
      )}
    </div>
  );
};

export default Login;
