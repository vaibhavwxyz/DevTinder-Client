import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import AuthGuard from "./components/AuthGuard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout>
                <Home />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Layout>
                <Profile />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/feed"
          element={
            <AuthGuard>
              <Layout>
                <Feed />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/connections"
          element={
            <AuthGuard>
              <Layout>
                <Connections />
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/requests"
          element={
            <AuthGuard>
              <Layout>
                <Requests />
              </Layout>
            </AuthGuard>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
