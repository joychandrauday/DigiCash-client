import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminComponent = ({user}) => {
  // Example data (replace with actual data from your API or state)
  const totalTransactions = 500;
  const totalAgents = 20;
  const [totalUsers, setTotalUsers] = useState([]);
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8000/users", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched user data:", data); // Log fetched data
        setTotalUsers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Replace with actual API call to fetch transaction data by day
    const fetchTransactionData = async () => {
      try {
        const response = await fetch("http://localhost:8000/transactions", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched transaction data:", data); // Log fetched data
        // Example: Transform data to daily transaction amounts
        const dailyTransactions = data.map((transaction) => ({
          date: transaction.date, // Assuming you have a date field in your transaction data
          amount: transaction.amount,
        }));
        setTransactionData(dailyTransactions);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchTransactionData();
  }, []);

  // Function to handle section toggling
  const [activeSection, setActiveSection] = useState("users"); // Default active section

  const handleSectionToggle = (section) => {
    setActiveSection(section);
  };

  // Example data for the bar chart
  const chartData = [
    { name: 'Red', uv: 12, pv: 2400, amt: 2400 },
    { name: 'Blue', uv: 19, pv: 4567, amt: 4567 },
    { name: 'Yellow', uv: 3, pv: 1398, amt: 1398 },
    { name: 'Green', uv: 5, pv: 9800, amt: 9800 },
    { name: 'Purple', uv: 2, pv: 3908, amt: 3908 },
    { name: 'Orange', uv: 3, pv: 4800, amt: 4800 },
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Admin Dashboard Section */}
      <section className="text-primary p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        <h2 className="text-2xl font-bold mb-4">Welcome Admin,{user.name}</h2>

        </div>
        {/* Toggle Buttons */}
        <div className="mb-4">
          <button
            className={`btn ${activeSection === "users" ? "btn-primary" : "btn-secondary"} mr-2`}
            onClick={() => handleSectionToggle("users")}
          >
            Users
          </button>
          <button
            className={`btn ${activeSection === "transactions" ? "btn-primary" : "btn-secondary"} mr-2`}
            onClick={() => handleSectionToggle("transactions")}
          >
            Transactions
          </button>
          <button
            className={`btn ${activeSection === "overview" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => handleSectionToggle("overview")}
          >
            Overview
          </button>
        </div>

        {/* Conditional Rendering based on activeSection */}
        {activeSection === "users" && (
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
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Example Row */}
                {totalUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge badge-primary">{user.role}</span>
                    </td>
                    <td className="flex gap-5">
                      {
                        user.isAgent && <button className="btn-sm btn">make agent</button> || user.role === 'pending' && <button className="btn-sm btn">Approve</button> || user.role === 'agent' && <button className="btn-sm btn">Make Agent</button>
                      }
                      {
                        <button className="btn-sm btn">Delete user</button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === "transactions" && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Transaction History</h3>
            {/* Transaction list */}
            <ul className="divide-y divide-gray-200">
              {/* Example transaction item */}
              {transactionData.map((transaction, index) => (
                <li key={index} className="py-4 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">
                      Transaction ID: {index + 1}
                    </span>
                    <span className="text-sm text-gray-500">
                      Amount: ${transaction.amount.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Date: {transaction.date}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="badge badge-primary">Successful</span>
                    <button className="btn btn-sm btn-outline-primary">
                      View Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === "overview" && (
          <div>
            <h3 className="text-xl font-semibold mb-2">System Overview</h3>
            <div className="mb-4">
              {/* Recharts Bar Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={transactionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Add other overview components here */}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminComponent;
