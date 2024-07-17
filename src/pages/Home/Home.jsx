import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import UserComponent from "./UserComponent";
import { FaSignOutAlt } from 'react-icons/fa';
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import AdminComponent from './AdminComoinent';
import useUser from "../../hooks/useUser";
import AgentComponent from "./AgentComponent";

const Home = () => {
  
  const axiosPublic = useAxiosPublic();
  const user=useUser()
  

  const handleLogout = () => {
    axiosPublic.get('/logout', { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          toast.success("You are logged out.");
          // Redirect to login or homepage after logout
          window.location.href = '/';
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

  console.log(admin); // Log user state to debug

  return (
    <div>
      <Helmet>
        <title>DigiCash | Digitalise your cash with DigiCash.</title>
      </Helmet>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-600 text-white py-4">
          <div className="container flex justify-between items-center mx-auto px-4">
            <h1 className="text-3xl font-bold">
              Welcome to DigiCash Dashboard
            </h1>
            <div className="bg-white w-1/6 rounded px-4">
              <img
                src="https://i.ibb.co/G3rfDHB/digicash-main-logo-1-2.png"
                className="w-full"
                alt="DigiCash Logo"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {admin ? (
            <AdminComponent user={user} />
          ) : agent ? (
            <AgentComponent/>
          ) : (
            <UserComponent />
          )}
        </main>
        <div className="wrap flex items-center justify-center">
          <button 
            className="relative flex items-center px-4 py-2 font-semibold text-white transition-transform duration-300 bg-blue-500 rounded hover:bg-blue-700 group hover:scale-105 border-none" 
            onClick={handleLogout}
          >
            <span className="group-hover:mr-2">Sign Out</span>
            <FaSignOutAlt className="absolute right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
