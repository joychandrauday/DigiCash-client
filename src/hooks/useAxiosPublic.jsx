import axios from 'axios';
import { useCookies } from 'react-cookie';

const useAxiosPublic = () => {
  const [cookies] = useCookies(['token']);

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = cookies.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxiosPublic;

