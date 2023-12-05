import React from "react";
import "./peopleGrid.scss";

const PeopleGrid = () => {
  return (
    <section className="peopleGrid neu-01 line" data-items="3">
      <div className="peopleGrid__wrapper">
        <div className="peopleGrid__heading">
          <h2 className="peopleGrid__title">
            <span>Hội đồng quản trị</span>
          </h2>
        </div>
        <div className="peopleGrid__container">
          <article className="peopleGrid__item">
            <figure>
              <img
                src={require("../../assets/images/profile01.jpg")}
                alt=""
              />
            </figure>
            <h3 className="peopleGrid__name">
              Far far away, behind the world m
            </h3>
            <p className="peopleGrid__description">Chủ tịch</p>
          </article>

          <article className="peopleGrid__item">
            <figure>
              <img
                src={require("../../assets/images/profile02.jpg")}
                alt=""
              />
            </figure>
            <h3 className="peopleGrid__name">
              Far far away, behind the world m
            </h3>
            <p className="peopleGrid__description">Quản trị viên-Ủy quyền</p>
          </article>

          <article className="peopleGrid__item">
            <figure>
              <img
                src={require("../../assets/images/profile03.jpg")}
                alt=""
              />
            </figure>
            <h3 className="peopleGrid__name">
              Far far away, behind the world m
            </h3>
            <p className="peopleGrid__description">Hội viên</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PeopleGrid;
