import React from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic"; // Ensure this hook is correctly implemented
import toast from "react-hot-toast"; // Assuming you are using react-hot-toast for notifications
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const axiosPublic = useAxiosPublic(); 
  const navigate=useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    const { name, pin, mobile, email, isAgent } = data;

    

    const userInfo = {
      name,
      pin,
      mobile,
      email,
      role: 'pending',
      isAgent,
    };
    console.log(userInfo);
    axiosPublic
      .post('/users/register', userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data.user) {
          toast.success('Registration successful! Please wait for admin approval.'); 
          
          navigate('/login')
        } else {
          toast.error('Registration failed. Please try again later.'); // Notify user if registration fails
        }
      })
      .catch((error) => {
        toast.error('Something went wrong');
        console.error(error); 
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-neutral rounded-md flex items-center justify-center gap-4 p-8">
        <img
          src="https://i.ibb.co/BnC3ZFs/digicash-logo-s-white-trans.png"
          className="w-3/6"
          alt="Digicash Logo"
        />
        <div className="space-y-8 text-black">
          <div>
            <h2 className="text-center text-3xl font-bold text-primary">
              Register to Get Started
            </h2>
          </div>
          <form
            className="mt-8 space-y-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
              autoComplete="name"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-800"
              placeholder="Full Name"
              required
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
            <input
              type="text"
              id="pin"
              {...register("pin", {
                required: "PIN is required",
                pattern: {
                  value: /^\d{5}$/,
                  message: "PIN must be a 5-digit number",
                },
              })}
              autoComplete="off"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm mt-4 bg-gray-800"
              placeholder="5-digit PIN"
              required
            />
            {errors.pin && (
              <p className="mt-2 text-sm text-red-500">
                {errors.pin.message}
              </p>
            )}
            <input
              type="text"
              id="mobile"
              {...register("mobile", { required: "Mobile Number is required" })}
              autoComplete="mobile"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm mt-4 bg-gray-800"
              placeholder="Mobile Number"
              required
            />
            {errors.mobile && (
              <p className="mt-2 text-sm text-red-500">
                {errors.mobile.message}
              </p>
            )}
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              autoComplete="email"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm mt-4 bg-gray-800"
              placeholder="Email address"
              required
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="isAgent"
                {...register("isAgent")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAgent" className="ml-2 block text-sm text-gray-400">
                Join as Agent
              </label>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm">
                <p className="text-gray-400">
                  Note: Your account will be pending until approved by admin.
                </p>
              </div>
              <div className="text-sm">
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  sign in
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
