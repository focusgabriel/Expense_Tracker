/** @format */

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { navItems } from "../constants";
import { useState } from "react";
import { LogOut, LogIn } from "lucide-react";

const SideBar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setIsLoggedIn(false);
  };
  const { pathname } = useLocation();

  return (
    <aside className="sidebar-xs-bottom flex flex-col shrink-0 w-16 lg:w-48 border-r border-slate-100 bg-white px-1.5 py-4 h-screen">
      {/* Logo */}
      <div className="flex mb-6 h-10 items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-sm">
        <span className="text-lg font-bold tracking-tight">ET</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-1 gap-1 w-full">
        {navItems.map(({ name, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <a
              key={name}
              href={href}
              aria-label={name}
              className={`group flex items-center justify-center lg:justify-start lg:px-3 gap-3 h-11 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Icon size={20} className="shrink-0 transition-all duration-200 group-hover:scale-105" />
              <span className="hidden lg:inline truncate">{name}</span>
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="flex mt-auto border-t border-slate-100 pt-3 justify-center">
        <button
          onClick={logout}
          className="flex items-center justify-center lg:justify-start lg:px-3 gap-3 rounded-lg py-2 w-full text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          {isLoggedIn ? (
            <LogOut size={18} className="shrink-0" />
          ) : (
            <LogIn size={18} className="shrink-0" />
          )}
          <span className="hidden lg:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;