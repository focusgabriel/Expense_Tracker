import axios,{
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void,
  reject: (error: unknown) => void
}[] = [];

function processQueue(error:unknown, token:string | null=null){
  failedQueue.forEach((promise) =>{
    if(error){
      promise.reject(error);
    } else {
      promise.resolve(token!)
    }
  });

  failedQueue = [];
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
const refreshClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

// Separate instance for token refresh to avoid interceptor loops
const tokenRefreshClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

// request
refreshClient.interceptors.request.use((config: InternalAxiosRequestConfig) => { 
  console.log("Request:", config.url);
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});


// response
  refreshClient.interceptors.response.use(
  (response) => {
    return response
  },
  
  async(error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if(error.response?.status === 401 && !originalRequest._retry){

    // implementing race condition handler.
    // Queue check before refresh
    if(isRefreshing){
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve:(token) => {
              originalRequest.headers = originalRequest.headers ?? {};
              originalRequest.headers.Authorization = `Bearer ${token}`;

              resolve(refreshClient(originalRequest));
            },
            reject,
          })
        })
      }
      // retrying. This prevents an infinite retry loop.
      originalRequest._retry = true

      const refreshToken = localStorage.getItem("refreshToken");

      // console.log("Refresh token:", refreshToken);
      if(!refreshToken){
        return Promise.reject(error);
      }

      try { 
      // Refreshing flag 
      isRefreshing = true;
    
      const response = await tokenRefreshClient.post("/refresh", {refreshToken});

      const {accessToken, refreshToken:newRefreshToken} = response.data;
      console.log("Refresh succeeded", response.data);
      
      localStorage.setItem(
        "accessToken",
        accessToken
      )

      console.log("new Acess token", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken)

      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      // Queue processing. Everybody waiting receives the new token.
      processQueue(null, accessToken);

      return refreshClient(originalRequest);

    } catch(err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      processQueue(err);
      toast.error("Session expired. Please log in again.", {
        position: "top-right",
        duration: 5000
      });
      window.location.href = "/";

      return Promise.reject(error);

    } finally {
      isRefreshing = false;
    }
  }

    return Promise.reject(error);
  }
)

export default refreshClient;