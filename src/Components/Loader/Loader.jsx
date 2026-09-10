import React from "react";
import { Bars } from "react-loader-spinner";

export default function Loader() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Bars
        height="80"
        width="80"
        color="#00298d"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}
