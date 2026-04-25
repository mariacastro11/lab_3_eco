import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/auth.service";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import BadgeIcon from "@mui/icons-material/Badge";
import StoreIcon from "@mui/icons-material/Store";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"consumer" | "store" | "delivery">(
    "consumer",
  );
  const [storeName, setStoreName] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await register({
        name,
        email,
        password,
        role,
        storeName: role === "store" ? storeName : undefined,
      });
      alert("User created successfully");
      navigate("/login");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
            <PersonAddIcon fontSize="large" className="text-purple-600" />
            Register
          </h1>
          <p className="text-center text-gray-500 mb-4">
            Create your account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="flex items-center gap-2 pb-2">
                <PersonIcon fontSize="small" className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Name</span>
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="flex items-center gap-2 pb-2">
                <EmailIcon fontSize="small" className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="flex items-center gap-2 pb-2">
                <BadgeIcon fontSize="small" className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Role</span>
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "consumer" | "store" | "delivery")
                }
              >
                <option value="consumer">Consumer</option>
                <option value="store">Store</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            {role === "store" && (
              <div className="flex flex-col">
                <label className="flex items-center gap-2 pb-2">
                  <StoreIcon fontSize="small" className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Store name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pizza Palace"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
            )}

            <button type="submit" className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors mt-2 flex items-center justify-center gap-2">
              <PersonAddIcon fontSize="small" />
              Register
            </button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:text-purple-800 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
