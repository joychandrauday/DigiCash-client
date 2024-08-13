import React from "react";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { imageUpload } from "../../api/utils/index";
const Registration = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    const image = data.image[0];
    try {
      const { name, pin, mobile, email, isAgent } = data;
      const imageUrl = await imageUpload(image);
      const userInfo = {
        name,
        pin,
        mobile,
        email,
        role: "pending",
        isAgent,
        image_url: imageUrl || null,
      };

      const response = await axiosPublic.post("/users/register", userInfo);

      if (response.data.user) {
        toast.success("Registration successful! Please wait for admin approval.");
        navigate("/login");
      } else {
        toast.error("Registration failed. Please try again later.");
      }
    } catch (error) {
      toast.error("Email or Phone number is already in use.");
      console.error(error);
    }
  };

  return (
    <div className="lg:min-h-screen flex items-center justify-center bg-gray-900 lg:py-12 lg:px-4 sm:px-6">
      <div className="bg-neutral lg:rounded-md lg:flex items-center justify-center gap-4 p-8">
        <img
          src="https://i.ibb.co/BnC3ZFs/digicash-logo-s-white-trans.png"
          className="lg:w-3/6 mx-auto"
          alt="Digicash Logo"
        />
        <div className="space-y-8 text-black">
          <h2 className="text-center text-3xl font-bold text-primary">
            Register to Get Started
          </h2>
          <form className="mt-8 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
              autoComplete="name"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-800"
              placeholder="Full Name"
            />
            {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
            
            <input
              type="password"
              id="pin"
              {...register("pin", {
                required: "PIN is required",
                pattern: {
                  value: /^\d{5}$/,
                  message: "PIN must be a 5-digit number",
                },
              })}
              autoComplete="off"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-4 bg-gray-800"
              placeholder="5-digit PIN"
            />
            {errors.pin && <p className="mt-2 text-sm text-red-500">{errors.pin.message}</p>}
            
            <input
              type="number"
              id="mobile"
              {...register("mobile", {
                required: "Mobile Number is required",
                minLength: {
                  value: 11,
                  message: "Mobile Number must be 11 digits",
                },
                maxLength: {
                  value: 11,
                  message: "Mobile Number must be 11 digits",
                },
                pattern: {
                  value: /^[0-9]{11}$/,
                  message: "Mobile Number must contain only digits",
                },
              })}
              autoComplete="mobile"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-4 bg-gray-800"
              placeholder="Mobile Number"
            />
            {errors.mobile && <p className="mt-2 text-sm text-red-500">{errors.mobile.message}</p>}
            
            <div>
              <label htmlFor="image" className="block mb-2 text-sm text-gray-400">
                Select Image:
              </label>
              <input
                type="file"
                id="image"
                {...register("image", { required: "Image is required" })}
                accept="image/*"
                className="file:border-none file:bg-blue-500 file:text-white"
              />
            </div>

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
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mt-4 bg-gray-800"
              placeholder="Email address"
            />
            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
            
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

            <div className="flex items-center justify-between mt-6 text-sm">
              <p className="text-gray-400">
                Note: Your account will be pending until approved by admin.
              </p>
              <a
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </a>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
