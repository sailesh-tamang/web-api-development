"use client";
import React from "react";
import useAuth from "../lib/useAuth";
import UserProfile from "../component/profile/UserProfile";

export default function ProfilePage() {
  const { ready } = useAuth({ requireLogin: true });

  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        Loading...
      </div>
    );
  }

  return <UserProfile />;
}