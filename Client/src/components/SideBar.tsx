/** @format */

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { navItems } from "../constants";
import { useState } from "react";

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
    <aside className="sidebar-xs-bottom flex flex-row sm:flex-col shrink-0 w-16 border-r border-slate-200 bg-white px-2 py-4 shadow-sm transition-all duration-300 sm:w-56 sm:px-4 sm:h-screen">
      <div className="mb-8 flex h-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 sm:justify-start sm:px-3">
        <span className="text-lg font-bold">ET</span>
        <span className="ml-2 hidden text-sm font-semibold text-emerald-900 sm:inline">
          Expense Tracker
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {navItems.map(({ name, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <a
              key={name}
              href={href}
              aria-label={name}
              className={`group flex h-11 items-center justify-center rounded-lg px-3 text-sm font-medium transition sm:justify-start ${isActive && "bg-emerald-50 text-emerald-700"} hover:bg-emerald-50 hover:text-emerald-700`}
            >
              <Icon
                size={20}
                className="shrink-0 transition group-hover:scale-105"
              />
              <span className="ml-3 hidden truncate sm:inline">{name}</span>
            </a>
          );
        })}
      </nav>

      <div className="relative bottom-10">
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-gray-300 text-center cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={logout}
            className="p-2 rounded-lg bg-gray-300 text-center cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
