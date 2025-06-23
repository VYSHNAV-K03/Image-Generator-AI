import React, { useEffect } from "react";
import axios from "axios";
import backgroundImage from "../assets/img.jpg";

const Home = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center text-center position-relative"
      style={{
        backgroundImage: `url("/images/bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "92vh",
        color: "white",
      }}
    >
      {/* Dark overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      ></div>

      {/* Content */}
      <div className="position-relative p-5">
        <h1 className="display-3 fw-bold mb-4">VISION CRAFT</h1>
        <p className="lead mb-4">
          AI-powered social media platform for generating and sharing images and
          insights.
        </p>
        <a
          href="/login"
          className="btn btn-light btn-lg px-4 py-2 rounded-pill shadow-sm"
        >
          Start Generating
        </a>
      </div>
    </div>
  );
};

export default Home;
