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
    <aside className="sidebar-xs-bottom flex flex-row sm:flex-col shrink-0 w-16 border-r border-slate-100 bg-white/95 backdrop-blur-sm px-1.5 py-3 sm:w-56 sm:px-3 sm:h-screen sm:py-5">
      <div className="mb-6 flex h-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white sm:justify-start sm:px-3 sm:shadow-sm">
        <span className="text-lg font-bold">ET</span>
        <span className="ml-2 hidden text-sm font-semibold tracking-wide sm:inline">
          Expense Tracker
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 sm:gap-1">
        {navItems.map(({ name, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <a
              key={name}
              href={href}
              aria-label={name}
              className={`group relative flex h-11 items-center justify-center rounded-xl px-3 text-sm font-medium transition-all duration-200 sm:justify-start ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Icon
                size={20}
                className="shrink-0 transition-all duration-200 group-hover:scale-105"
              />
              <span className="ml-3 hidden truncate sm:inline">{name}</span>
            </a>
          );
        })}
      </nav>

      <div className="sm:mt-auto sm:border-t sm:border-slate-100 sm:pt-3">
        <button
          onClick={logout}
          className="flex h-11 w-full items-center justify-center rounded-xl text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 sm:justify-start sm:px-3"
        >
          {isLoggedIn ? (
            <LogOut size={20} className="shrink-0" />
          ) : (
            <LogIn size={20} className="shrink-0" />
          )}
          <span className="ml-3 hidden truncate sm:inline">
            {isLoggedIn ? "Logout" : "Sign In"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
