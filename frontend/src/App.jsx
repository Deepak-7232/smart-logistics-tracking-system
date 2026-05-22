import { Routes, Route, Navigate } from "react-router-dom";

import Login          from "./pages/Login";
import Dashboard      from "./pages/Dashboard";
import Shipments      from "./pages/Shipments";
import Drivers        from "./pages/Drivers";
import Vehicles       from "./pages/Vehicles";
import TrackShipment  from "./pages/TrackShipment";
import Unauthorized   from "./pages/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"            element={<Login />} />
      <Route path="/track"       element={<TrackShipment />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected — any authenticated user */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard  /></ProtectedRoute>} />
      <Route path="/shipments" element={<ProtectedRoute><Shipments  /></ProtectedRoute>} />
      
      {/* Admin Only */}
      <Route path="/drivers"   element={<ProtectedRoute requiredRole="ADMIN"><Drivers    /></ProtectedRoute>} />
      <Route path="/vehicles"  element={<ProtectedRoute requiredRole="ADMIN"><Vehicles   /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

