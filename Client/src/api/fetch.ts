import axios,{
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
const refreshClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

// request
refreshClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
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
      console.log("Attempting refresh...");
      console.log("Retrying:", originalRequest.url);
      originalRequest._retry = true
      const refreshToken = localStorage.getItem("refreshToken");

      console.log("Refresh token:", refreshToken);
      if(!refreshToken){
        return Promise.reject(error);
      }
      try { 
      const response = await refreshClient.post("http://localhost:3000/api/v1/refresh", {refreshToken});

      const {accessToken, refreshToken:newRefreshToken} = response.data;
      console.log("Refresh succeeded", response.data);
      
      localStorage.setItem(
        "accessToken",
        accessToken
      )

      console.log("new Acess token", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken)

      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
      // return refreshClient(originalRequest);

      const retryResponse = await refreshClient(originalRequest);

      console.log("Retry status:", retryResponse.status);

      return retryResponse;
      
    } catch(err) {
      console.log("failed");
      console.log("error is:", err)
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
      return Promise.reject(error);
    }
  }

    return Promise.reject(error);
  }
)

export default refreshClient;