import { useState, useEffect } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // New state for search input

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleEditChange = (e, userId) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [name]: name === "coins" ? parseInt(value, 10) || 0 : value, // Convert 'coins' to integer
      },
    }));
  };

  const handleUpdateUser = async (userId) => {
    try {
      const updatedData = {
        ...editData[userId],
        isAdmin: editData[userId]?.isAdmin === "true",
      };

      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, updatedData }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      fetchUsers(); // Refresh users after update
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-4">
      <h2 className="text-2xl mb-4">Users</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by username..."
        className="mb-4 p-2 border border-gray-300 rounded flex justify-end w-1/5"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        filteredUsers.map((user) => (
          <div key={user._id} className="mb-4 p-4 bg-white shadow rounded">
            <div className="mb-2">
              <label className="font-semibold">Username:</label>
              <input
                className="ml-2 p-1 border border-gray-300 rounded"
                type="text"
                name="username"
                value={editData[user._id]?.username || user.username}
                onChange={(e) => handleEditChange(e, user._id)}
              />
            </div>
            <div className="mb-2">
              <label className="font-semibold">User ID:</label>
              <input
                className="ml-2 p-1 border border-gray-300 rounded w-96"
                type="text"
                name="userId"
                value={editData[user._id]?.userId || user.userId}
                onChange={(e) => handleEditChange(e, user._id)}
                readOnly
              />
            </div>
            <div className="mb-2">
              <label className="font-semibold">Coins:</label>
              <input
                className="ml-2 p-1 border border-gray-300 rounded"
                type="number"
                name="coins"
                value={editData[user._id]?.coins || user.coins}
                onChange={(e) => handleEditChange(e, user._id)}
              />
            </div>
            <div className="mb-2">
              <label className="font-semibold">Is Admin:</label>
              <select
                className="ml-2 p-1 border border-gray-300 rounded"
                name="isAdmin"
                value={
                  editData[user._id]?.isAdmin !== undefined
                    ? editData[user._id].isAdmin
                    : user.isAdmin
                }
                onChange={(e) => handleEditChange(e, user._id)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <button
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
              onClick={() => handleUpdateUser(user._id)}
            >
              Update
            </button>
          </div>
        ))
      )}
    </div>
  );
}
