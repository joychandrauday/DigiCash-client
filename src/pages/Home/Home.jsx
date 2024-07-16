import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminComoinent from "./AdminComoinent";
import UserComponent from "./UserComponent";

const Home = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/user", {
          method: "GET",
          credentials: "include", // Use 'credentials' instead of 'withCredentials'
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Fetched user data:", data); // Log fetched data
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);
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
                className="w-full
                "
                alt=""
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {(admin && <AdminComoinent user={user} />) ||
            (agent && <div>agent</div>) || <UserComponent user={user} />}
        </main>
      </div>
    </div>
  );
};

export default Home;
