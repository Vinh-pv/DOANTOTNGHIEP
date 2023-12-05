import React, { useContext } from 'react';
import './footer.scss';
import { Link } from 'react-router-dom';
import { SvgLogo } from '../svgs/SvgLogo';
import { SvgFaceBook } from '../svgs/SvgFaceBook';
import { SvgYoutube } from '../svgs/SvgYoutube';
import { SvgInstagram } from '../svgs/SvgInstagram';
import { Context } from '../../context/Context';

const Footer = () => {
  const { user } = useContext(Context);
  return (
    <footer className="footer" style={{backgroundColor: user?.isAdmin ? "#333" : "#0f2f7f"}}>
      <div className="footer__wrapper">
        <div className="footer__top">
          <div className="footer__links anime">
            <div className="footer__logo"><SvgLogo /></div>
            <div className="footer__icons anime">
              <Link to="/" className="footer__icon"><SvgFaceBook /></Link>
              <Link to="/" className="footer__icon"><SvgYoutube /></Link>
              <Link to="/" className="footer__icon"><SvgInstagram /></Link>
            </div>
          </div>
          <div className="footer__links anime">
            <p className="footer__desc anime">Far far away, behind the</p>
            <p className="footer__desc anime">Far far away, behind the world mountains, far from the countries</p>
            <p className="footer__desc anime">Far far away, behind the world mountains, far from the countries Vokalia and Consonantia, theres</p>
            <p className="footer__desc anime">Email: abc@gmail.com</p>
            <p className="footer__desc anime">Hotline: 0123456789</p>
          </div>
          <div className="footer__links anime">
            <Link to="/" className="footer__link anime">Câu hỏi thường gặp</Link>
            <Link to="/" className="footer__link anime">Tin tức</Link>
            <Link to="/" className="footer__link anime">Chính sách & bảo mật</Link>
          </div>
        </div>
        <div className="footer__bottom anime">
          <p className="footer__text">© Logo. Đã đăng ký Bản quyền</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer