import { Routes, Route, Navigate } from "react-router-dom";
import { ROLES } from "./constants/roles";

import Login          from "./pages/Login";
import Register       from "./pages/Register";
import Dashboard      from "./pages/Dashboard";
import Shipments      from "./pages/Shipments";
import MyShipments    from "./pages/MyShipments";
import MyVehicle      from "./pages/MyVehicle";
import Profile        from "./pages/Profile";
import Drivers        from "./pages/Drivers";
import Vehicles       from "./pages/Vehicles";
import TrackShipment  from "./pages/TrackShipment";
import Unauthorized   from "./pages/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ── Public routes ─────────────────────────────────────────── */}
      <Route path="/"             element={<Login />} />
      <Route path="/register"     element={<Register />} />
      <Route path="/track"        element={<TrackShipment />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ── Protected — ADMIN + DRIVER ───────────────────────────── */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* ── ADMIN ONLY ─────────────────────────────────────────────── */}
      <Route path="/shipments" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <Shipments />
        </ProtectedRoute>
      } />
      <Route path="/drivers" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <Drivers />
        </ProtectedRoute>
      } />
      <Route path="/vehicles" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <Vehicles />
        </ProtectedRoute>
      } />

      {/* ── DRIVER ONLY ─────────────────────────────────────────────── */}
      <Route path="/my-shipments" element={
        <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
          <MyShipments />
        </ProtectedRoute>
      } />
      <Route path="/my-vehicle" element={
        <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
          <MyVehicle />
        </ProtectedRoute>
      } />

      {/* ── Catch-all ─────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
