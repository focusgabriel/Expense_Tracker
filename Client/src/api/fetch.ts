import axios,{
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

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
      // console.log("Attempting refresh...");
      // console.log("Retrying:", originalRequest.url);
    //   console.log("Failed URL:", error.config?.url);
    // console.log("Status:", error.response?.status);
console.log("Failed request:", error.config?.url);
    if(error.response?.status === 401 && !originalRequest._retry){

    // 1. Queue check before refresh
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

      console.log("Refresh token:", refreshToken);
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
      console.log("failed");
      console.log("error is:", err)
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      processQueue(err);
      // isRefreshing = false;
      window.location.href = "/";

      return Promise.reject(error);

    } finally {
       //refreshing flag
      isRefreshing = false;
    }
  }

    // return Promise.reject(error);
  }
)

export default refreshClient;