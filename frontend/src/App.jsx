import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute, PublicRoute } from "./Protected";
import Login from "./pages/userLogin/Login";
import Home from "./pages/home/Home";
import UserDetail from "./pages/userDetail/UserDetail";
import Setting from "./pages/settingSection/Setting";
import Status from "./pages/statusSection/Status";
import useUserStore from "./store/useUserStore";

function App() {
  // Debug: Check localStorage on app start
  console.log("LocalStorage keys:", Object.keys(localStorage));
  console.log("User store state:", useUserStore.getState());

  return (
    <>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/user-login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/user-profile" element={<UserDetail />} />
            <Route path="/status" element={<Status />} />
            <Route path="/setting" element={<Setting />} />
          </Route>
        </Routes>
      </Router>

      <ToastContainer limit={1} position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
