import "./spinner.scss";
import React from "react";
import { SvgSpinner } from "../svgs/SvgSpinner";

const Spinner = ({color}) => {
  return (
    <div className="spinnerWrapper">
      <SvgSpinner color={color} />
    </div>
  );
};

export default Spinner;