import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { FriendsScreen } from './screens/FriendsScreen/FriendsScreen'
import { GameScreen } from './screens/GameScreen/GameScreen'
import { HomeScreen } from './screens/HomeScreen/HomeScreen'
import { LoginScreen } from './screens/LoginScreen/LoginScreen'
import { ProfileScreen } from './screens/ProfileScreen/ProfileScreen'
import { SettingsScreen } from './screens/SettingsScreen/SettingsScreen'
import { SignupScreen } from './screens/SignupScreen/SignupScreen'
import { AppContextProvider } from './contexts/appContext/context'

window.addEventListener('keydown', (event) => {
  if (event?.key === 'Backspace' || event?.code === 'Backspace') {
    event.preventDefault()
  }
})

window.addEventListener('keyup', (event) => {
  if (event?.key === 'Backspace' || event?.code === 'Backspace') {
    event.preventDefault()
  }
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeScreen />,
  },
  {
    path: '/friends',
    element: <FriendsScreen />,
  },
  {
    path: '/game',
    element: <GameScreen />,
  },
  {
    path: '/home',
    element: <HomeScreen />,
  },
  {
    path: '/login',
    element: <LoginScreen />,
  },
  {
    path: '/profile',
    element: <ProfileScreen />,
  },
  {
    path: '/settings',
    element: <SettingsScreen />,
  },
  {
    path: '/signup',
    element: <SignupScreen />,
  },
])

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')

  async function greet() {
    setGreetMsg(await invoke('save_state', { someNumber: 1234 }))
  }

  return (
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  )
}

export default App
