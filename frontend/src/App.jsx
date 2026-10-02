import { useState } from 'react'
import { Container, Typography, Box, Snackbar, Alert, Divider } from '@mui/material'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginForm from './components/auth/LoginForm'
import AppHeader from './components/layout/AppHeader'
import EquipmentDataGrid from './components/equipment/EquipmentDataGrid'
import Dashboard from './components/dashboard/Dashboard'

function AppContent(){
  const {isAuthenticated} = useAuth()

   if (!isAuthenticated) {
        return <LoginForm />;
    }

    return (
        <>
            <AppHeader />
            <Dashboard />
        </>
    );
}
function App() {
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  )
}

export default App
