import React from "react";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div>
      <h2>My Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
