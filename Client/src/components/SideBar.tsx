/** @format */

import { useLocation } from "react-router-dom";
import { navItems } from "../constants";

const SideBar = () => {
  const {pathname} = useLocation();
  return (
    <aside className="sidebar-xs-bottom flex h-auto w-16 shrink-0 flex-col border-r border-slate-200 bg-white px-2 py-4 shadow-sm transition-all duration-300 sm:w-56 sm:px-4">
      <div className="mb-8 flex h-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 sm:justify-start sm:px-3">
        <span className="text-lg font-bold">ET</span>
        <span className="ml-2 hidden text-sm font-semibold text-emerald-900 sm:inline">
          Expense Tracker
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {navItems.map(({ name, icon: Icon, href }) => {
          const isActive = pathname === href
          return(
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
          )
        })}
      </nav>
    </aside>
  );
};

export default SideBar;
