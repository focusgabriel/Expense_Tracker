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

refreshClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// export default refreshClient;


  refreshClient.interceptors.response.use(
  (response) => {
    return response
  },
  
  async(error: AxiosError) => {
    if(error.response?.status === 401){
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if(error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        const refreshToken = localStorage.getItem("refreshToken");
        if(!refreshToken){
          return Promise.reject(error);
        }
       try { 
        const response = await refreshClient.post("/refresh", {
          refreshToken,
        });

        const {accessToken, refreshToken:newRefreshToken} = response.data;
        localStorage.setItem(
          "accessToken",
          accessToken
        )

        localStorage.setItem(
          "refreshToken",
          newRefreshToken
        )

        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
        return refreshClient(originalRequest);
      } catch {
      
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
      }

      return Promise.reject(error);
    }

  }
)

export default refreshClient;