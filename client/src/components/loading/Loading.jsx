import "./loading.scss";
import React from "react";
import { SvgLoading } from "../svgs/SvgLoading";

const Loading = () => {
  return (
    <div className="loader">
      <SvgLoading />
    </div>
  );
};

export default Loading;