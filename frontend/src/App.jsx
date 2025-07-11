import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
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
const ProtectedRoute = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

// Публичный маршрут
const PublicRoute = () => {
  const token = localStorage.getItem('token')
  if (token) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
}

function App() {
  return (
    <ThemeProvider>
      <MobileMenuProvider>
        <ToastProvider>
      <Toaster position="top-right" />
      <Routes>
            {/* Корневой маршрут */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Публичные маршруты */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Защищенные маршруты */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/employees/:id" element={<EmployeeDetail />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/components-test" element={<ComponentsTest />} />
              </Route>
          </Route>

            {/* Маршрут для несуществующих страниц */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
        </ToastProvider>
      </MobileMenuProvider>
    </ThemeProvider>
  )
}

export default App 