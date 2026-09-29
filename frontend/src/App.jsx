

import { useUser } from '@clerk/clerk-react'
import {Routes,Route,Navigate} from 'react-router'
import HomePage from './pages/HomePage.jsx'
import ProblemsPage from './pages/ProblemsPage.jsx'
import ProblemPage from './pages/ProblemPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import SessionPage from './pages/SessionPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { Toaster } from 'react-hot-toast'



function App() {
 const {isLoaded,isSignedIn}=useUser()
  if(!isLoaded){ 
    return null; // or a loading spinner, etc.
  }
  return (
    <>
     <Routes>
    {/* <h1 className='bg-amber-800'>Welcome to the App</h1> */}
     <Route path="/" element={!isSignedIn ? <HomePage/> : <Navigate to={"/dashboard"} />} />
     <Route path="/dashboard" element={isSignedIn ? <DashboardPage/> : <Navigate to={"/"} />} />
      
     <Route path="/problems" element={ isSignedIn ? <ProblemsPage/> : <Navigate to={"/"}  />}/>
     <Route path="/problem/:id" element={ isSignedIn ? <ProblemPage/> : <Navigate to={"/"}  />}/>
     <Route path="/session/:id" element={ isSignedIn ? <SessionPage/> : <Navigate to={"/"}  />}/>
     <Route path="/profile" element={ isSignedIn ? <ProfilePage/> : <Navigate to={"/"}  />}/>
     <Route path="*" element={<NotFoundPage />} />
   </Routes>
   <Toaster position='top-right' toastOptions={{duration:3000}}/>
    </>
  )
}

export default App
