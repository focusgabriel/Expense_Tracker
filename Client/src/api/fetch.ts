import axios,{
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";


interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
const refreshClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

const tokenRefreshClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

// response
  refreshClient.interceptors.response.use(
    
  (response) => {
    return response
  },
  
  async(error: AxiosError) => {
    
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if(error.response?.status === 401 && !originalRequest._retry){

      originalRequest._retry = true

      if (!originalRequest) {
        return Promise.reject(error);
      }
      try { 

      await tokenRefreshClient.post("/refresh", {}, {
        withCredentials: true,
      })


      return refreshClient(originalRequest)

    } catch(err) {
        toast.error("Session expired. Please log in again.", {
          position: "top-right",
          duration: 5000
        });

        if (window.location.pathname !== "/") {
          window.location.replace("/");
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
)

export default refreshClient;