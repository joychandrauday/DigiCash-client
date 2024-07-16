import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const [user, setUser] = useState([]);
  // Example data (replace with actual data from your API or state)
  const totalUsers = 100;
  const totalTransactions = 500;
  const totalAgents = 20;
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
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">
              Welcome to DigiCash Dashboard
            </h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {(admin && (
            <div>
              <div className="container mx-auto p-4">
                {/* Admin Dashboard Section */}
                <section className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

                  {/* Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Total Users Card */}
                    <div className="bg-blue-200 p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-2">
                        Total Users
                      </h3>
                      <p className="text-3xl font-bold">{totalUsers}</p>
                    </div>

                    {/* Total Transactions Card */}
                    <div className="bg-green-200 p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-2">
                        Total Transactions
                      </h3>
                      <p className="text-3xl font-bold">{totalTransactions}</p>
                    </div>

                    {/* Total Agents Card */}
                    <div className="bg-yellow-200 p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-2">
                        Total Agents
                      </h3>
                      <p className="text-3xl font-bold">{totalAgents}</p>
                    </div>
                  </div>

                  {/* User Management */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
                    <div className="flex mb-4">
                      <input
                        type="text"
                        placeholder="Search user by name"
                        className="input input-bordered w-full max-w-xs mr-2"
                      />
                      <button className="btn btn-primary">Search</button>
                    </div>
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Example Row */}
                        <tr>
                          <td>John Doe</td>
                          <td>john.doe@example.com</td>
                          <td>
                            <span className="badge badge-primary">Active</span>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-warning mr-2">
                              Block
                            </button>
                            <button className="btn btn-sm btn-success">
                              Activate
                            </button>
                          </td>
                        </tr>
                        {/* Repeat rows dynamically based on data */}
                      </tbody>
                    </table>
                  </div>

                  {/* Transaction History */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Transaction History
                    </h3>
                    {/* Transaction list */}
                    <ul className="divide-y divide-gray-200">
                      {/* Example transaction item */}
                      <li className="py-4 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold">
                            Transaction ID: 123456789
                          </span>
                          <span className="text-sm text-gray-500">
                            Amount: $100.00
                          </span>
                          <span className="text-sm text-gray-500">
                            Date: 2024-07-16
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <span className="badge badge-primary">
                            Successful
                          </span>
                          <button className="btn btn-sm btn-outline-primary">
                            View Details
                          </button>
                        </div>
                      </li>
                      {/* Repeat dynamically based on transaction data */}
                    </ul>
                  </div>
                </section>
              </div>
            </div>
          )) ||
            (agent && <div>agent</div>) || (
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
                  <h2 className="text-lg font-semibold mb-4">
                    Account Balance
                  </h2>
                  <p className="text-4xl font-bold text-blue-600">
                    {user?.balance === 0
                      ? "Your Registration is in under review"
                      : `৳ ${user.balance}`}
                  </p>
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
            )}
        </main>
      </div>
    </div>
  );
};

export default Home;
