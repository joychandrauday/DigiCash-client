import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import UserComponent from "./UserComponent";
import { FaSignOutAlt } from "react-icons/fa";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import AdminComponent from "./AdminComoinent";
import useUser from "../../hooks/useUser";
import AgentComponent from "./AgentComponent";
import { HiOutlineLogout } from "react-icons/hi";
const Home = () => {
  const axiosPublic = useAxiosPublic();
  const user = useUser();

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

  const admin = user.role === "admin";
  const agent = user.role === "agent";
  
  return (
    <div>
      <Helmet>
        <title>DigiCash | Digitalise your cash with DigiCash.</title>
      </Helmet>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-600 text-white py-4">
          <div className="container lg:flex justify-between items-center mx-auto px-4">
            <h1 className="text-3xl text-center lg:text-left font-bold lg:w-1/3">
              Welcome to DigiCash Dashboard
            </h1>
            <div className=" lg:w-1/3 my-4 lg:my-0 rounded px-4">
              <div className="rounded shadow-lg bg-white">
                
                <img
                  src="https://i.ibb.co/G3rfDHB/digicash-main-logo-1-2.png"
                  className="w-1/2 logo mx-auto"
                  alt="DigiCash Logo " 
                />
              </div>
            </div>
            <div className="lg:w-1/3 flex items-center justify-center lg:justify-end">
              <button
                className=" flex gap-2 text-md items-center justify-center font-bold group shadow-sm bg-red-600 px-5 py-2 shadow-black"
                onClick={handleLogout}
              >
                <span className="">Sign Out</span>
                <HiOutlineLogout className="group-hover:translate-x-2 transition-transform font-bold text-2xl"/>
                
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {admin ? (
            <AdminComponent user={user} />
          ) : agent ? (
            <AgentComponent />
          ) : (
            <UserComponent />
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
