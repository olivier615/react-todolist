import './App.css';
import { useState } from 'react'
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom"
import { AuthContext, UserNameContext } from './components/Context'
import LoginInLayout from './components/loginView/LoginInLayout'
import SignUp from './components/loginView/LogIn'
import SignIn from './components/loginView/SignUp'
import ListPage from './components/todoList/ListPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [token, setToken] = useState(null)
  const [userName, setUserName] = useState('')
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <UserNameContext.Provider value={{ userName, setUserName }}>
        <Routes>
          <Route path="/" element={<LoginInLayout />}>
            <Route index element={<SignUp />} />
            <Route path="signin" element={<SignIn />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="todolist" element={<ListPage />} />
          </Route>
        </Routes>
      </UserNameContext.Provider>
    </AuthContext.Provider>
  )
}

export default App;
