import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import {BrowserRouter} from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AxiosInterceptor from './components/AxiosInterceptor.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if(!PUBLISHABLE_KEY){
  throw new Error("Missing Clerk Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your environment variables.")
}
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
 
<BrowserRouter> 
<QueryClientProvider client={queryClient}>
 <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AxiosInterceptor>
        <App />
      </AxiosInterceptor>
    </ClerkProvider>
    </QueryClientProvider>
</BrowserRouter>
    
)
