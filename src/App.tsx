import {Toaster} from "react-hot-toast"
import {Routes, Route} from "react-router-dom"
import ChatPage from "./pages/ChatPage"
import ProfilePage from "./pages/ProfilePage"
import Contacts from "./pages/Contacts"
import LoginPage from "./pages/Login" 
import SignUpPage from "./pages/SignUpPage"
import { useAppDispatch } from "./redux/reduxHook"
import type { UserLoginInfo } from "./lib/const"
import { Login } from "./lib/services/userService"
import { use, useEffect } from "react"
import { useAppSelector } from "./redux/reduxHook"
import { selectUserInfo } from "./redux/userSlice"

function App() {
  

  
  return (
    <main className="flex gap-1 h-screen w-screen" > 
      <Toaster position="top-center" />
      <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<ChatPage/>} />      
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/contacts" element={<Contacts/>} /> 
        <Route path="/login" element={<LoginPage/>} /> {/* Use LoginPage component */}
        <Route path="/signup" element={<SignUpPage/>} />
      </Routes>
      </div>
      
    </main>
  )
}

export default App
