import React from 'react';
import { FaSpinner } from "react-icons/fa";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <FaSpinner className="loading-spinner" />
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;