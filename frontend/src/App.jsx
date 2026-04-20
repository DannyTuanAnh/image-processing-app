import Home from "./pages/Home";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UploadProvider } from "./context/UploadContext";

function App() {
  return (
    <UploadProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </UploadProvider>
  );
}
export default App;
