import React from 'react'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { MobileMenuProvider } from './context/MobileMenuContext'
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import EmployeeDetail from './pages/EmployeeDetail'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import Help from './pages/Help'
import Faq from './pages/Faq'
import ComponentsTest from './pages/ComponentsTest'

// Защищенный маршрут
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Публичный маршрут
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  if (token) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <MobileMenuProvider>
            <ToastProvider>
              <Routes>
                {/* Публичные маршруты */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  } 
                />
                
                {/* Защищенные маршруты */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="employees" element={<Employees />} />
                  <Route path="employees/:id" element={<EmployeeDetail />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="help" element={<Help />} />
                  <Route path="faq" element={<Faq />} />
                  <Route path="components-test" element={<ComponentsTest />} />
                </Route>

                {/* Редирект для неизвестных маршрутов */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </ToastProvider>
          </MobileMenuProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App 