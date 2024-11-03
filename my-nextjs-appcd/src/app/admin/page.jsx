"use client";
import withAuthAdmin from "../components/adminAuth";

export function Dashboard() {
  return (
    <div>
      <h1>hi with you</h1>
    </div>
  );
}

export default withAuthAdmin(Dashboard, "/login");
