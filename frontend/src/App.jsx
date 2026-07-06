

import { useUser } from '@clerk/react'
import {Routes,Route,Navigate} from 'react-router'
import HomePage from './pages/HomePage.jsx'
import ProblemsPage from './pages/ProblemsPage.jsx'
import { Toaster } from 'react-hot-toast'
function App() {
 const {isLoaded,isSignedIn}=useUser()
 console.log("isSignedIn",isSignedIn)

  return (
    <>
     <Routes>
    {/* <h1 className='bg-amber-800'>Welcome to the App</h1> */}
     <Route path="/" element={<HomePage/>}/>

     <Route
      path="/problems"
      element={!isLoaded ? null : isSignedIn ? <ProblemsPage/> : <Navigate to={"/"} replace />}
     />
   </Routes>
   <Toaster position='top-right' toastOptions={{duration:3000}}/>
    </>
  )
}

export default App
