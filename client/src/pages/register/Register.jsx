import "./register.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";

const Register = () => {
  useEffect(() => {
    document.title = "Đăng ký - Quản lý KTX.";
  }, []);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      res.data && window.location.replace("/login");
    } catch (err) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  };

  return (
    <div className="register">
      <h2 className="register__title">Đăng ký</h2>
      <form className="register__form" onSubmit={handleSubmit}>
        <label htmlFor="">Tên người dùng</label>
        <input
          className="register__input"
          type="text"
          placeholder="Tên người dùng"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="">Email</label>
        <input
          className="register__input"
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="">Mật khẩu</label>
        <input
          className="register__input"
          type="password"
          placeholder="Mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="register__button" type="submit">
          Đăng ký
        </button>
      </form>
      <div className="register__link">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </div>
      {error && <span className="register__error">Có lỗi khi đăng ký!</span>}
    </div>
  );
};

export default Register;
