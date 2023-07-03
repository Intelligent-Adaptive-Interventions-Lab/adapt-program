import React from "react";
import { classnames } from "../utils/general";

const CustomInput = ({ customInput, setCustomInput }) => {
  return (
    <>
      <div class="py-2 fw-bold text-light">
        <h4>Custom input:</h4>
      </div>
      <textarea
        rows="5"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        class="col-12 border border-white p-2 bg-black text-light"
      ></textarea>
    </>
  );
};

export default CustomInput;
