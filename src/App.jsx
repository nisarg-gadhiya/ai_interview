import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/home"
import Auth from "./pages/Auth"
import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "./redux/userSlice"
import { serverUrl } from "./utils/serverUrl"

function App() {

  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const getUser = async () =>{
      try {
        // Check if token exists in cookies before making the request
        const cookies = document.cookie.split(';').map(c => c.trim())
        const hasToken = cookies.some(c => c.startsWith('token='))
        
        if (hasToken) {
          const result = await axios.get(serverUrl + "/api/user/current-user", { withCredentials: true })
          dispatch(setUserData(result.data))
        } else {
          dispatch(setUserData(null))
        }
      }
      catch (error) {
        console.log("Error fetching user:", error.message)
        dispatch(setUserData(null))
      }
      finally {
        setIsLoading(false)
      }
    }
    getUser()
  },[dispatch])

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={userData ? <Navigate to="/" /> : <Auth/>} />
    </Routes>
  )
}

export default App
