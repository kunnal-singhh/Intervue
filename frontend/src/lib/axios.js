import axios from "axios";


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true, // this will allow the browser to send cookies along with the request
});

export default axiosInstance;