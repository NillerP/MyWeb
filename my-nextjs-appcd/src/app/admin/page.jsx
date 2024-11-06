"use client";
import { useState } from "react";
import withAuthAdmin from "../components/adminAuth";
import Users from "./adminAssets/users"; // Import Users component

export function Dashboard() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/6 min-h-screen bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Sidebar</h2>
        <nav className="flex flex-col space-y-4">
          <button
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700"
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard
          </button>
          <button
            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-700"
            onClick={() => setActiveSection("users")}
          >
            Users
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold">Main Content Area</h1>

        {activeSection === "dashboard" && (
          <div>
            <h2>Dashboard Content</h2>
            {/* Add any dashboard-specific content here */}
          </div>
        )}

        {activeSection === "users" && (
          <Users /> // Render Users component when "Users" section is active
        )}
      </main>
    </div>
  );
}

export default withAuthAdmin(Dashboard, "/login");
