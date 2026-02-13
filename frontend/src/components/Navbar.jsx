import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear login token
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-gray-900 text-white px-6 py-3 rounded-md shadow-md mb-4">
      <h1 className="text-xl font-bold">PocketBinge Dashboard</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
