import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "./useAxiosPublic";
import toast from "react-hot-toast";

export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const axiosPublic=useAxiosPublic()
  const handleLogout = () => {
    axiosPublic
      .get("/logout", { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          toast.success("You are logged out.");
          // Redirect to login or homepage after logout
          window.location.href = "/";
        } else {
          toast.error("Something went wrong.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.error(error);
      });
  };
  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        handleLogout();
        navigate("/sign-in");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
