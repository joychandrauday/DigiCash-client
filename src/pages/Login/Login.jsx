import React from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic"; // Ensure this hook is correctly implemented
import toast from "react-hot-toast"; // Assuming you are using react-hot-toast for notifications
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const axiosPublic = useAxiosPublic(); // Assuming this hook is correctly configured
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const userInfo = {
      identifier: data.identifier,
      pin: data.password,
    };

    axiosPublic
      .post('/users/login', userInfo, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.data.token) {
          toast.success('You are signed in!!');
          navigate("/");
        } else {
          toast.error('Login failed. Please check your credentials.'); // Notify user if login fails
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
        // console.error(error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 sm:px-6">
      <div className="bg-neutral rounded-md flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 max-w-sm sm:max-w-md md:max-w-lg w-full">
        <img
          src="https://i.ibb.co/BnC3ZFs/digicash-logo-s-white-trans.png"
          className="w-2/3 sm:w-1/2 lg:w-3/6"
          alt="Digicash Logo"
        />
        <div className="text-black w-full">
          <form
            className=""
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              id="identifier"
              {...register("identifier", { required: "Identifier is required" })}
              autoComplete="identifier"
              className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800"
              placeholder="Email address or phone Number"
              required
            />
            {errors.identifier && (
              <p className="mt-2 text-sm text-red-500">
                {errors.identifier.message}
              </p>
            )}
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
              })}
              autoComplete="current-password"
              className="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-4 bg-gray-800"
              placeholder="Pin Number"
              required
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 text-sm">
              <div className="text-center sm:text-left">
                <a
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Don't have an account? Register and get 40 Taka bonus.
                </a>
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
