import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardMorador from './pages/DashboardMorador';
import DashboardAgente from './pages/DashboardAgente';
import EnviarDenuncia from './pages/EnviarDenuncia';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/dashboard-morador" 
              element={
                <ProtectedRoute allowedRoles={['MORADOR']}>
                  <DashboardMorador />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard-agente" 
              element={
                <ProtectedRoute allowedRoles={['AGENTE', 'ADMIN']}>
                  <DashboardAgente />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/enviar-denuncia" 
              element={
                <ProtectedRoute allowedRoles={['MORADOR']}>
                  <EnviarDenuncia />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

