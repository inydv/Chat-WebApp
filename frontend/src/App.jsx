import { Route, Router, Routes } from "react-router-dom";
import { Chat, Login, Setting, Status } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user-login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/status" element={<Status />} />
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;
