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
    <aside className="sidebar-xs-bottom flex flex-row md:flex-col shrink-0 md:w-56 border-r border-slate-100 bg-white md:px-4 md:py-5 md:h-screen">
      {/* Logo */}
      <div className="hidden md:flex mb-6 h-10 items-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-3 shadow-sm">
        <span className="text-lg font-bold tracking-tight">ET</span>
        <span className="ml-2 text-sm font-semibold tracking-wide">Expense Tracker</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-row md:flex-col flex-1 gap-0.5 md:gap-1 w-full">
        {navItems.map(({ name, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <a
              key={name}
              href={href}
              aria-label={name}
              className={`group flex items-center justify-center md:justify-start h-11 flex-1 md:flex-none rounded-lg md:px-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Icon size={20} className="shrink-0 transition-all duration-200 group-hover:scale-105" />
              <span className="hidden md:inline ml-3 truncate">{name}</span>
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="hidden md:flex md:mt-auto md:border-t md:border-slate-100 md:pt-3">
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 w-full text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          {isLoggedIn ? (
            <LogOut size={18} className="shrink-0" />
          ) : (
            <LogIn size={18} className="shrink-0" />
          )}
          <span>{isLoggedIn ? "Logout" : "Sign In"}</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;