import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  const firstLetter = user.username.charAt(0).toUpperCase();

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto"
            style={{ width: "100px", height: "100px", fontSize: "36px" }}
          >
            {firstLetter}
          </div>
        </div>
        <h3 className="text-center mb-3">{user.username}</h3>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Email:</strong> {user.email}
          </li>
          <li className="list-group-item">
            <strong>Phone:</strong> {user.phone}
          </li>
          <li className="list-group-item">
            <strong>Role:</strong> {user.role}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
