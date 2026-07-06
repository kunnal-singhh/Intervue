import { Show, SignInButton, SignOutButton, SignUpButton, UserButton } from '@clerk/react'
// import { useQuery } from '@tanstack/react-query'
// import axiosInstance from '../lib/axios.js'
function HomePage() {
 //with tanstack
//   const {data,isLoading,error,refetch}=useQuery({ 
// queryFn:()=> axiosInstance.get("/sessions"), // this will make a GET request to http://localhost:3000/api/sessions
//   })
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        home
       <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <SignOutButton />
          <UserButton />
        </Show>
    </div>
  )
}

export default HomePage
