import React from "react";

const OutputDetails = ({ outputDetails }) => {
  return (
    <div class="container mt-3 d-flex flex-column p-0">
      <p class="text-sm">
      <span class="text-light">Status:</span>{" "}
        <span class="fw-semibold px-2 py-1 bg-white">
          {outputDetails?.status?.description}
        </span>
      </p>
      <p class="text-sm">
        <span class="text-light">Memory:</span>{" "}
        <span class="fw-semibold px-2 py-1 bg-white">
          {outputDetails?.memory}
        </span>
      </p>
      <p class="text-sm">
      <span class="text-light">Time:</span>{" "}
        <span class="fw-semibold px-2 py-1 bg-white">
          {outputDetails?.time}
        </span>
      </p>
    </div>
  );
};

export default OutputDetails;
