/** @format */

import AddTask from "./components/AddTask";
import { Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
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
