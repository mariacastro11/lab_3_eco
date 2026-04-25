import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth.service";
import LoginIcon from "@mui/icons-material/Login";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const data = await login({ email, password });
      const role = data.user?.user_metadata?.role;

      if (role === "consumer") navigate("/consumer/stores");
      else if (role === "store") navigate("/store/my-store");
      else if (role === "delivery") navigate("/delivery/available-orders");
      else navigate("/");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
            <LoginIcon fontSize="large" className="text-indigo-600" />
            Login
          </h1>
          <p className="text-center text-gray-500 mb-4">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="flex items-center gap-2 pb-2">
                <EmailIcon fontSize="small" className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="flex items-center gap-2 pb-2">
                <LockIcon fontSize="small" className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors mt-2 flex items-center justify-center gap-2">
              <LoginIcon fontSize="small" />
              Login
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
