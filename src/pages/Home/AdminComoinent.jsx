import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import useTransaction from "../../hooks/useTransaction";
import Swal from "sweetalert2";

const AdminComponent = ({ user }) => {
  const [totalUsers, setTotalUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterMethod, setFilterMethod] = useState("all");
  const axiosPublic = useAxiosPublic();

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
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Fetched user data:", data); // Log fetched data
        setTotalUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const result = totalUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(result);
  }, [searchQuery, totalUsers]);

  const transactionData = useTransaction();
  console.log(transactionData);

  const filteredTransactionData =
    filterMethod === "all"
      ? transactionData
      : transactionData.filter(
          (transaction) => transaction.method === filterMethod
        );

  const handleApprove = (mobile) => {
    axiosPublic
      .patch(`/users/${mobile}`, { withCredentials: true })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success("User approved successfully.");
        } else {
          toast.error("Something went wrong.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.error(error);
      });
  };

  const handleAgent = (mobile) => {
    console.log(mobile);
    axiosPublic
      .patch(`/agent/${mobile}`, { withCredentials: true })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success("User approved successfully.");
        } else {
          toast.error("Something went wrong.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.error(error);
      });
  };

  const handleDelete = (mobile) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .delete(`/user/${mobile}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "The user has been deleted.",
                icon: "success",
              });
              window.location.reload();
            } else {
              Swal.fire({
                title: "Error",
                text: "Some Error occurred.",
                icon: "error",
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            Swal.fire({
              title: "Error",
              text: "An error occurred while deleting the user.",
              icon: "error",
            });
          });
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (method) => {
    setFilterMethod(method);
  };

  const aggregateTransactionData = (transactions) => {
    const aggregatedData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    }, {});

    return Object.keys(aggregatedData).map((date) => ({
      date,
      amount: aggregatedData[date],
    }));
  };

  const aggregatedTransactionData = aggregateTransactionData(
    filteredTransactionData
  );

  const aggregateMethodData = (transactions) => {
    const methodCounts = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.method]) {
        acc[transaction.method] = 0;
      }
      acc[transaction.method] += transaction.amount;
      return acc;
    }, {});

    return Object.keys(methodCounts).map((method) => ({
      name: method, // Add 'name' field with method name
      value: methodCounts[method], // 'value' remains the amount
    }));
  };

  const transactionsByMethod = aggregateMethodData(transactionData);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="container mx-auto p-4">
      <section className="text-primary p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <h2 className="text-2xl font-bold mb-4">
            Welcome Admin, {user.name}
          </h2>
        </div>
        <Tabs>
          <TabList>
            <Tab>Users</Tab>
            <Tab>Transactions</Tab>
            <Tab>Overview</Tab>
          </TabList>

          <TabPanel>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Search user by name"
                  className="input input-bordered w-full max-w-xs mr-2"
                  value={searchQuery}
                  onChange={handleSearchChange}
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
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge badge-primary">{user.role}</span>
                      </td>
                      <td className="flex gap-5">
                        {user.isAgent && user.role === "user" && (
                          <button
                            disabled={user.role === "agent"}
                            className="btn-sm btn"
                            onClick={() => handleAgent(user.mobile)}
                          >
                            Make Agent
                          </button>
                        )}

                        {user.role === "pending" && (
                          <button
                            className="btn-sm btn"
                            onClick={() => handleApprove(user.mobile)}
                          >
                            Approve
                          </button>
                        )}
                        <button
                          disabled={user.role === "admin"}
                          className="btn-sm btn"
                          onClick={() => handleDelete(user.mobile)}
                        >
                          Delete User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabPanel>

          <TabPanel>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Transaction History
              </h3>
              <div className="flex gap-4 mb-4">
                <button
                  className="btn btn-sm rounded-none text-warning"
                  onClick={() => handleFilterChange("all")}
                >
                  All
                </button>
                <button
                  className="btn btn-sm rounded-none text-warning"
                  onClick={() => handleFilterChange("send-money")}
                >
                  Send Money
                </button>
                <button
                  className="btn btn-sm rounded-none text-warning"
                  onClick={() => handleFilterChange("cashout")}
                >
                  Cash Out
                </button>
                <button
                  className="btn btn-sm rounded-none text-warning"
                  onClick={() => handleFilterChange("cashin")}
                >
                  Cash In
                </button>
              </div>
              <div className="divide-y grid grid-cols-3 gap-4 divide-gray-400">
                {filteredTransactionData.map((transaction) => (
                  <div key={transaction._id} className="py-2">
                    <p className="text-xl text-primary font-bold">
                      Amount: {transaction.amount}
                    </p>
                    <p>
                      <span className="text-primary font-bold">Method:</span>{" "}
                      {transaction.method}
                    </p>
                    <p>
                      <span className="text-primary font-bold">Timestamp:</span>{" "}
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <span className="text-primary font-bold">Sender:</span>{" "}
                      {transaction.sender}
                    </p>
                    <p>
                      <span className="text-primary font-bold">Receiver:</span>{" "}
                      {transaction.receiver}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="flex justify-between flex-wrap">
              <div className="w-1/2">
                <h3 className="text-xl font-semibold mb-2">
                  Daily Transaction Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aggregatedTransactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2">
                <h3 className="text-xl font-semibold mb-2 text-center">
                  All Transaction Overview
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transactionsByMethod}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ payload }) => {
                        if (!payload) return null; // Check if payload exists
                        const { name, value, percent } = payload;
                        return `${name}: ${(percent * 100).toFixed(0)}%`;
                      }}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {transactionsByMethod.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </section>
    </div>
  );
};

export default AdminComponent;
