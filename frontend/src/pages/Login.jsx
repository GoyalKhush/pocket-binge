import React, { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");

      const res = await loginUser(email, password);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-10 rounded-2xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
          Login to <span className="text-white">PocketBinge</span>
        </h1>

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

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 text-black py-3 rounded-lg font-bold"
        >
          Login
        </button>

        <p className="text-center text-gray-400 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-400">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
