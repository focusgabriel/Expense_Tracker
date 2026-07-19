/** @format */

import AddTask from "./components/AddTask";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SideBar from "./components/SideBar";
import { Plus } from "lucide-react";
import AllTransaction from "./pages/AllTransaction";
import SuccessfulMsg from "./pages/SuccessfulMsg";
import EditForm from "./pages/Form";
import Analytics from "./pages/Analytics";
import DeletePage from "./pages/DeletePage";
import Login from "./services/auth/login";
import Register from "./services/auth/register";
import ProtectedRoutes from "./components/Routes";

const App = () => {
  const location = useLocation();
  const authRoutes = ["/", "/register"];
  const isAuthRoute = authRoutes.some(
    r => location.pathname === r || location.pathname.startsWith(r + "/"),
  );

  return (
    <div
      className={
        isAuthRoute
          ? "min-h-screen bg-slate-50"
          : "flex h-auto bg-slate-50 w-full"
      }
    >
      {!isAuthRoute && <SideBar />}
      <main
        className={
          isAuthRoute
            ? "min-h-screen w-full"
            : "main-with-bottom-sidebar w-full flex-1 px-4 py-6 sm:px-6 lg:px-8"
        }
      >
        {!isAuthRoute && (
          <div className="mb-6 flex items-center justify-between gap-4 border-2 border-amber-500">
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
        )}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/task"
            element={
              <ProtectedRoutes>
                <AddTask />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/overview"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/transaction"
            element={
              <ProtectedRoutes>
                <AllTransaction />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoutes>
                <SuccessfulMsg />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoutes>
                <Analytics />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoutes>
                <EditForm />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/delete/:id"
            element={
              <ProtectedRoutes>
                <DeletePage />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;