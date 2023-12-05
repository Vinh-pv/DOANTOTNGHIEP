import React from "react";
import { SvgEmptyResults } from "../svgs/SvgEmptyResults";
import "./emptyResults.scss";

const EmptyResults = () => {
  return (
    <div className="emptyResults">
      <div className="emptyResults__wrapper">
        <figure className="emptyResults__icon">
          <SvgEmptyResults />
        </figure>
        <p className="emptyResults__message">
          Không có <br />
          kết quả nào được tìm thấy cho tìm kiếm của bạn.
        </p>
      </div>
    </div>
  );
};

export default EmptyResults;
