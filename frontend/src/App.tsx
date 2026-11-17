import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import DisplayPage from './pages/display/DisplayPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman utama tetap menampilkan Display */}
        <Route path="/" element={<DisplayPage />} />

        {/* Halaman Display TV */}
        <Route path="/display" element={<DisplayPage />} />

        {/* Dashboard Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Alamat lainnya kembali ke Display */}
        <Route path="*" element={<Navigate to="/display" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
