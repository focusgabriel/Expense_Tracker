/** @format */

import AddTask from "./components/AddTask";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Dashboard";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import AllTransaction from "./pages/AllTransaction";
import EditForm from "./pages/Form";
import VerifyEmail from "./pages/verifyEmail";
import Analytics from "./pages/Analytics";
import Logout from "./services/auth/Logout";
import Login from "./services/auth/login";
import Register from "./services/auth/register";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import ForgotPassword from "./services/auth/ForgotPassword";
import NewPassword from "./services/auth/NewPassword";
import MonthlyReport from "./components/Reports";
import Insight from "./components/Insight";
import { PUBLIC_ROUTES } from "./constants";

const App = () => {
  const location = useLocation();
  const isAuthRoute = PUBLIC_ROUTES.some(
    r => location.pathname === r || location.pathname.startsWith(r + "/"),
  );

  return (
    <div
      className={
        isAuthRoute
          ? "min-h-screen bg-slate-50"
          : "flex h-screen overflow-hidden bg-slate-50 w-full "
      }
    >
      <Toaster position="top-right" />
      {!isAuthRoute && <SideBar />}
      <main
        className={
          isAuthRoute
            ? "min-h-screen w-full"
            : "main-with-bottom-sidebar w-full flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
        }
      >
        {!isAuthRoute && <Header />}
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoutes>
                <Login />
              </PublicRoutes>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoutes>
                <Register />
              </PublicRoutes>
            }
          />
          <Route
            path="/forgotPassword"
            element={
              <PublicRoutes>
                <ForgotPassword />
              </PublicRoutes>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PublicRoutes>
                <NewPassword />
              </PublicRoutes>
            }
          />
          <Route
            path="/task"
            element={
              <ProtectedRoutes>
                <AddTask />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoutes>
                <MonthlyReport />
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
                <AllTransaction
                  summary={{
                    totalIncome: 0,
                    totalExpense: 0,
                    netBalance: 0,
                    monthlyIncome: 0,
                    monthlyExpense: 0,
                    monthlyBalance: 0,
                    previousMonthBalance: 0,
                  }}
                />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoutes>
                <Insight />
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
            path="/verify-email/:token"
            element={
              <PublicRoutes>
                <VerifyEmail />
              </PublicRoutes>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoutes>
                <Logout />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
