/** @format */

import AddTask from "./components/AddTask";
import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import AllTransaction from "./pages/AllTransaction";
import EditForm from "./pages/Form";
import Analytics from "./pages/Analytics";
// import DeletePage from "./pages/DeletePage";
import Logout from "./services/auth/Logout";
import Login from "./services/auth/login";
import Register from "./services/auth/register";
import ProtectedRoutes from "./components/Routes";
import PublicRoutes from "./components/PublicRoutes";

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
          : "flex h-screen overflow-hidden bg-slate-50 w-full "
      }
    >
      {!isAuthRoute && <SideBar />}
      <main
        className={
          isAuthRoute
            ? "min-h-screen w-full"
            : "main-with-bottom-sidebar w-full flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
        }
      >
        {!isAuthRoute && <Header />}
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<PublicRoutes><Login /></PublicRoutes>} />
          <Route path="/register" element={<PublicRoutes><Register /></PublicRoutes>} />
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
          {/* <Route
            path="/delete/:id"
            element={
              <ProtectedRoutes>
                <DeletePage />
              </ProtectedRoutes>
            }
          /> */}
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
