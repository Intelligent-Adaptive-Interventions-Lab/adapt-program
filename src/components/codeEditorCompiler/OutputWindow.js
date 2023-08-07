import React from "react";
import './OutputWindow.css';

const OutputWindow = ({ outputDetails }) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <pre class="px-2 py-1 text-danger">
          {atob(outputDetails?.compile_output)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="p-2 text-success">
          {atob(outputDetails.stdout) !== null
            ? `${atob(outputDetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre class="px-2 py-1 text-danger">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      return (
        <pre class="px-2 py-1 text-danger">
          {atob(outputDetails?.stderr)}
        </pre>
      );
    }
  };
  return (
    <>
      {/* <div class="py-2 fw-bold text-light">
        <h4>Result:</h4>
      </div> */}
      <div id="output" class="overflow-auto p-0 m-0 col-12 border border-top-0 border-white bg-black rounded-bottom-2">
        {outputDetails ? <>{getOutput()}</> : <><br /><br /><br /></>}
      </div>

    </>
  );
};

export default OutputWindow;
