import React, { useContext, useState } from 'react';
import './mainNav.scss';
import { Link, useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { SvgSearch } from '../svgs/SvgSearch';
import { SvgMenu } from '../svgs/SvgMenu';
import ImgDefault from '../../assets/images/img_default.jpg';
import { Context } from '../../context/Context';

const MainNav = () => {
  const { user, dispatch } = useContext(Context);
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  }

  const [keyword, setKeyword] = useState();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${keyword.trim().toLowerCase().replace(/\s/g, '+')}`);
  }

  return (
    <nav className="mainNav">
      <div className="mainNav__sticky">
        {/* Top Bar */}
        <section className="mainNav__topBar" style={{backgroundColor: user?.isAdmin ? "#333" : "#0f2f7f"}}>
          <div className="mainNav__wrapper">
            <div className="mainNav__linksLeft">
              <NavLink to="/" className="mainNav__logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><h2>{user?.isAdmin ? "Admin KTX." : "Sinh viên KTX."}</h2></NavLink>
              <Link to="/" className="mainNav__linkAlt">Trang chủ</Link>
              <NavLink to="/intro" className="mainNav__linkAlt">Giới thiệu</NavLink>
              {!user?.isAdmin && (
                <NavLink to="/contacts" className="mainNav__linkAlt">Gửi yêu cầu</NavLink>
              )}
              {user?.isAdmin && <NavLink to="/write" className="mainNav__linkAlt">Tạo phòng</NavLink>}
              {user && <div className="mainNav__linkAlt" onClick={handleLogout}>Đăng xuất</div>}
            </div>
            <div className="mainNav__aside">
              <form onSubmit={handleSubmit}>
                <div className="mainNav__search">
                  <span className="mainNav__icon mainNav__icon--search"><SvgSearch /></span>
                  <input type="search" placeholder="Tìm kiếm phòng" onChange={(e) => setKeyword(e.target.value)} />
                </div>
              </form>
              {user ? (
                  <NavLink to="/settings" className="mainNav__profile"><img src={user.profilePic ? user.profilePic : ImgDefault} alt="" /></NavLink>
                ) : (
                  <div className="mainNav__linksRight">
                    <NavLink to="/login" className="mainNav__linkAlt">Đăng nhập</NavLink>
                    <span>/</span>
                    <NavLink to="/register" className="mainNav__linkAlt">Đăng ký</NavLink>
                  </div>
                )
              }
              {/* <NavLink to="/language" className="mainNav__language">EN</NavLink> */}
              <div className="mainNav__icon mainNav__icon--menuMobile"><SvgMenu /></div>
            </div>
          </div>
          {/* Top BarMobile */}
          <div className="mainNav__topBarMobile">
            <div className="mainNav__wrapper">
              <div className="mainNav__linksCenter">
                <NavLink to="/" className="mainNav__linkAlt">Trang chủ</NavLink>
                <NavLink to="/intro" className="mainNav__linkAlt">Giới thiệu</NavLink>
                {!user?.isAdmin && (
                  <NavLink to="/contacts" className="mainNav__linkAlt">Gửi yêu cầu</NavLink>
                )}
                <NavLink to="/write" className="mainNav__linkAlt">Viết bài</NavLink>
                {user && <div className="mainNav__linkAlt" onClick={handleLogout}>Đăng xuất</div>}
              </div>    
            </div>
          </div>
        </section>
        {/* Menu Bar */}
        <section className="mainNav__menuBar">
          <ul className="mainNav__mainLinks">
            <li className="mainNav__menuItem">
              {!user?.isAdmin && (
                <NavLink to={`/registrations/${user?.username}`} className="mainNav__link">Lịch sử đăng ký</NavLink>
              )}
              {user?.isAdmin && (
                <NavLink to={`/registrations/`} className="mainNav__link">Quản lý thuê phòng</NavLink>
              )}
            </li>
            <li className="mainNav__menuItem">
              {user?.isAdmin && (
                <NavLink to={`/createUtilityBills/`} className="mainNav__link">Tạo hoá đơn điện nước</NavLink>
              )}
            </li>
            <li className="mainNav__menuItem">
              <NavLink to="/utilityBills" className="mainNav__link">Thông tin điện nước</NavLink>
            </li>
            <li className="mainNav__menuItem">
              <NavLink to="/historyContacts" className="mainNav__link">Xem phiếu yêu cầu</NavLink>
            </li>
          </ul>
        </section>
      </div>
    </nav>
  )
}

export default MainNav