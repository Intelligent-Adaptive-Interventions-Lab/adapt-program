import React from "react";

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
        <pre class="px-2 py-1 text-success">
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
      <div class="card p-0 m-0 col-12 border border-top-0 border-white bg-black rounded-top-0">
        {outputDetails ? <>{getOutput()}</> : <><br /><br /><br /></>}
      </div>
    </>
  );
};

export default OutputWindow;
