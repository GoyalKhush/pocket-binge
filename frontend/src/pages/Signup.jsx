import React, { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setError("");
      setSuccess("");

      await registerUser(name, email, password);

      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      console.error(err);
      setError("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-10 rounded-2xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-3 rounded bg-slate-700 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-slate-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded bg-slate-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400">{error}</p>}
        {success && <p className="text-green-400">{success}</p>}

        <button
          onClick={handleSignup}
          className="w-full bg-green-500 text-black py-3 rounded-lg font-bold mt-3"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
