import React from 'react'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import useAuth from './hooks/useAuth'
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

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <MobileMenuProvider>
            <ToastProvider>
              <Routes>
                <Route 
                  path="/login" 
                  element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
                  } 
                />
                
                {isAuthenticated ? (
                  <Route path="/" element={<Layout />}>
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
                ) : (
                  <Route path="*" element={<Navigate to="/login" replace />} />
                )}
              </Routes>
            </ToastProvider>
          </MobileMenuProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App 