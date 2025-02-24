import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_END_POINT,
})

axiosInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('USER_TOKEN')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('USER_TOKEN')
        localStorage.removeItem('USER_DATA')
      }
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Error setting up the request:', error.message)
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
