import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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
          throw new Error(`Network response was not ok: ${response.statusText}`);
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

  console.log("User state:", user); // Log user state to debug

  return (
    <div>
      <Helmet>
        <title>DigiCash | Digitalise your cash with DigiCash.</title>
      </Helmet>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-600 text-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">
              Welcome to DigiCash Dashboard
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                Profile Information
              </h2>
              {user ? (
                <>
                  <p className="text-gray-600 mb-2">Name: {user.name}</p>
                  <p className="text-gray-600 mb-2">Email: {user.email}</p>
                  <p className="text-gray-600 mb-2">
                    Mobile Number: {user.mobile}
                  </p>
                  <Link
                    to="/profile"
                    className="text-blue-600 hover:text-blue-700 font-medium mt-2 block"
                  >
                    View Profile
                  </Link>
                </>
              ) : (
                <p>Loading profile information...</p>
              )}
            </div>

            {/* Balance Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Account Balance</h2>
              <p className="text-4xl font-bold text-blue-600">{
                  user?.balance === 0 ? 'Your Registration is in under review': `৳ ${user.balance}`
                }</p>
              <Link
                to="/transactions"
                className="text-blue-600 hover:text-blue-700 font-medium mt-2 block"
              >
                View Transactions
              </Link>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/send-money"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Send Money
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cash-out"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Cash Out
                  </Link>
                </li>
                <li>
                  <Link
                    to="/balance-inquiry"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Balance Inquiry
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
