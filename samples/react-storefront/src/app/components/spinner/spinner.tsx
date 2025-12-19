import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
