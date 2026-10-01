import { useState } from 'react'
import { Container, Typography, Box, Snackbar, Alert, Divider } from '@mui/material'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginForm from './components/auth/LoginForm'
import AppHeader from './components/layout/AppHeader'
import EquipmentDataGrid from './components/equipment/EquipmentDataGrid'

function Dashboard(){
  const { user } = useAuth();
  const role = user?.role;
  const [notification, setNotification] = useState(null)
  return (
    <>
      <AppHeader/>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" sx={{ color: 'black' }} gutterBottom>
                    ATM Overview
                </Typography>
                <Box sx={{ mb: 4 }}>
                    <EquipmentDataGrid onSuccess={setNotification} />
                </Box>
    </Container>
    </>
  )
}

function AppContent(){
  const {isAuthenticated} = useAuth()

  return isAuthenticated ? <Dashboard/> : <LoginForm/>
}
function App() {
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  )
}

export default App
