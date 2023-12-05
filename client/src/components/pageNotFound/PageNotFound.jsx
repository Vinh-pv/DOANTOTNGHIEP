import React from 'react';
import { Link } from 'react-router-dom';
import './pageNotFound.scss'

const PageNotFound = () => {
  return (
    <div className="pageNotFound">
      <h1 className="pageNotFound__title">404</h1>
      <h3 className="pageNotFound__subtitle">Không tìm thấy trang</h3>
      <p className="pageNotFound__description">
      </p>
      <Link className='pageNotFound__link' to="/">Về Trang Chủ</Link>
    </div>
  );
};

export default PageNotFound;
