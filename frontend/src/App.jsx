

import { useUser } from '@clerk/clerk-react'
import {Routes,Route,Navigate} from 'react-router'
import HomePage from './pages/HomePage.jsx'
import ProblemsPage from './pages/ProblemsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import { Toaster } from 'react-hot-toast'
function App() {
 const {isLoaded,isSignedIn}=useUser()
 console.log("isSignedIn",isSignedIn)
  if(!isLoaded){ 
    return null; // or a loading spinner, etc.
  }
  return (
    <>
     <Routes>
    {/* <h1 className='bg-amber-800'>Welcome to the App</h1> */}
     <Route path="/" element={!isSignedIn ? <HomePage/> : <Navigate to={"/dashboard"} />} />
     <Route path="/dashboard" element={isSignedIn ? <DashboardPage/> : <Navigate to={"/"} />} />

     <Route
      path="/problems"
      element={ isSignedIn ? <ProblemsPage/> : <Navigate to={"/"}  />}
     />
   </Routes>
   <Toaster position='top-right' toastOptions={{duration:3000}}/>
    </>
  )
}

export default App
