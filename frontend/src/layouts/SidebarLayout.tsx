import type { ReactNode } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service";
import LogoutIcon from "@mui/icons-material/Logout";

export interface SidebarItem {
  label: string;
  path: string;
  icon: ReactNode;
}

interface SidebarLayoutProps {
  title: string;
  items: SidebarItem[];
  themeColor: string; // e.g., "teal", "orange", "lime"
}

export const SidebarLayout = ({ title, items, themeColor }: SidebarLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper to get active classes based on themeColor
  const getActiveClasses = (isActive: boolean) => {
    if (!isActive) {
      return "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    }

    // A mapping could be more dynamic, but since we are using tailwind classes,
    // we need to provide the full class names for purge/JIT.
    switch (themeColor) {
      case "teal":
        return "bg-teal-50 text-teal-700 border-r-4 border-teal-600";
      case "orange":
        return "bg-orange-50 text-orange-700 border-r-4 border-orange-600";
      case "lime":
        return "bg-lime-50 text-lime-700 border-r-4 border-lime-600";
      default:
        return "bg-blue-50 text-blue-700 border-r-4 border-blue-600";
    }
  };

  const getTitleColorClass = () => {
    switch (themeColor) {
      case "teal": return "text-teal-600";
      case "orange": return "text-orange-600";
      case "lime": return "text-lime-600";
      default: return "text-blue-600";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col z-20 hidden md:flex">
        <div className="p-6 border-b border-gray-100">
          <h2 className={`text-2xl font-bold ${getTitleColorClass()}`}>{title}</h2>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path.split("/").length > 2 ? false : true} // Avoid matching /consumer/stores exactly if it's subroutes, maybe just use end if it's main
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-6 py-3 font-medium transition-colors ${getActiveClasses(
                      isActive
                    )}`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-6 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium rounded-lg transition-colors"
          >
            <LogoutIcon fontSize="small" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto relative h-screen">
        <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center z-10 sticky top-0">
           <h2 className={`text-xl font-bold ${getTitleColorClass()}`}>{title}</h2>
           {/* Mobile menu logic could be added here later */}
           <button onClick={handleLogout} className="text-red-600">
             <LogoutIcon />
           </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};
