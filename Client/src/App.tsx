/** @format */

import AddTask from "./components/AddTask";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SideBar from "./components/SideBar";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import AllTransaction from "./pages/AllTransaction";
import SuccessfulMsg from "./pages/SuccessfulMsg";
import EditForm from "./pages/Form";
import Analytics from "./pages/Analytics";
import DeletePage from "./pages/DeletePage";
import Login from "./services/auth/login";
import Register from "./services/auth/register";

const App = () => {
  return (
    <div className="flex h-auto bg-slate-50 w-full">
      <SideBar />

      <main className="main-with-bottom-sidebar w-full flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Welcome back
          </h1>
          <Link
            to="/task"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Transaction</span>
          </Link>
        </div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/task" element={<AddTask />} />
          <Route path="/overview" element={<Dashboard />} />
          <Route path="/transaction" element={<AllTransaction />} />
          <Route path="/success" element={<SuccessfulMsg />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/edit/:id" element={<EditForm />} />
          <Route path="/delete/:id" element={<DeletePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
