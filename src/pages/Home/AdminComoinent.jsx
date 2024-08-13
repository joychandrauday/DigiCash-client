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
import "../../pages/styles.css";

const AdminComponent = ({ user }) => {
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalBalance, setTotalBalance] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [userPerPage] = useState(10);
  const [filterMethod, setFilterMethod] = useState("all");
  const [currentPageTransactions, setCurrentPageTransactions] = useState(1);
  const [transactionsPerPage] = useState(10);
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
  
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("http://localhost:8000/total-balance", {
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
        setTotalBalance(data);
      } catch (error) {
        console.error("Error fetching balance data:", error);
      }
    };

    fetchBalance();
  }, []);
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
    axiosPublic
      .patch(`/make-agent/${mobile}`, { withCredentials: true })
      .then((res) => {
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
  const handleAdmin = (mobile) => {
    // axiosPublic
    // .patch(`/admin/${mobile}`, { withCredentials: true })
    // .then((res) => {
    //   if (res.status === 200) {
    //     toast.success("User approved successfully.");
    //   } else {
    //     toast.error("Something went wrong.");
    //   }
    // })
    // .catch((error) => {
    //   toast.error("Something went wrong");
    //   console.error(error);
    // });

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Make Admin!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosPublic
          .patch(`/admin/${mobile}`, { withCredentials: true })
          .then((res) => {
            if (res.data.user.modifiedCount > 0) {
              Swal.fire({
                title: "Made Agent!",
                text: "The user has been made Agent.",
                icon: "success",
              });
              // Refresh the user data
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
              // Refresh the user data
              fetchUsers();
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

  // Pagination logic
  const indexOfLastUser = currentPageUsers * userPerPage;
  const indexOfFirstUser = indexOfLastUser - userPerPage;
  const currentUsers = Array.isArray(filteredUsers)
    ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    : [];

  const indexOfLastTransaction = currentPageTransactions * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = Array.isArray(filteredTransactionData)
    ? filteredTransactionData.slice(
        indexOfFirstTransaction,
        indexOfLastTransaction
      )
    : [];

  const userTotalPages = Math.ceil(filteredUsers?.length / userPerPage);
  const transactionTotalPages = Math.ceil(
    filteredTransactionData.length / transactionsPerPage
  );
  const handleApproveCash = (id, amount) => {
    if (user.balance < amount) {
      toast("Transaction amount must be at least 50 Taka.");
      return;
    }
    const approvalCredit = {
      requestId: id,
      agentMobile: user.mobile,
    };
    axiosPublic
      .post("/approve-cashin", approvalCredit, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          toast.success("Transaction successful...");
          window.location.reload();
        } else {
          toast.error("Transaction failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.error(error);
      });
  };
  const handleDeclineCasin = (id) => {
    const approvalCredit = {
      requestId: id,
      agentMobile: user.mobile,
    };
    axiosPublic
      .post("/decline-cashin", approvalCredit, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          toast.success("Transaction successful...");
          window.location.reload();
        } else {
          toast.error("Transaction failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.error(error);
      });
  };
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <section className="text-primary p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
            Admin Dashboard
          </h2>
          <h2 className="text-xl sm:text-2xl font-bold">
            Welcome Admin, {user?.name}
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
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Manage Users ({totalUsers?.length})
              </h3>
              <div className="flex flex-col sm:flex-row mb-4">
                <input
                  type="text"
                  placeholder="Search user by name"
                  className="input input-bordered w-full sm:w-auto sm:max-w-xs mb-2 sm:mb-0 sm:mr-2"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button className="btn commonbtn btn-primary">Search</button>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Balance</th>
                      <th>Mobile</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user?._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>৳ {user.balance}</td>
                        <td>{user.mobile}</td>
                        <td>{user.role}</td>
                        <td>
                          {user?.role === "pending" && (
                            <button
                              onClick={() => handleApprove(user?.mobile)}
                              className="btn commonbtn btn-success"
                            >
                              Approve
                            </button>
                          )}
                          {user?.role === "user" && (
                            <button
                              onClick={() => handleAgent(user?.mobile)}
                              className="btn commonbtn shadow-sm btn-warning"
                            >
                              Make Agent
                            </button>
                          )}
                          {user?.role === "agent" && (
                            <button
                              onClick={() => handleAdmin(user?.mobile)}
                              className="btn commonbtn shadow-sm btn-warning"
                            >
                              Make Admin
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user?.mobile)}
                            className="btn commonbtn shadow btn-error"
                            disabled={user?.role === "admin"}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  className="btn commonbtn btn-primary"
                  disabled={currentPageUsers === 1}
                  onClick={() => setCurrentPageUsers(currentPageUsers - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {currentPageUsers} of {userTotalPages}
                </span>
                <button
                  className="btn commonbtn btn-primary"
                  disabled={currentPageUsers === userTotalPages}
                  onClick={() => setCurrentPageUsers(currentPageUsers + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Transactions
              </h3>
              <div className="flex flex-col sm:flex-row mb-4">
                <button
                  className="btn commonbtn btn-primary mr-2"
                  onClick={() => handleFilterChange("all")}
                >
                  All Transactions
                </button>
                <button
                  className="btn commonbtn btn-primary mr-2"
                  onClick={() => handleFilterChange("cashin")}
                >
                  Cash In
                </button>
                <button
                  className="btn commonbtn btn-primary"
                  onClick={() => handleFilterChange("cashout")}
                >
                  Cash Out
                </button>
                <button
                  className="btn commonbtn btn-primary"
                  onClick={() => handleFilterChange("send-money")}
                >
                  Send Money
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Reciever</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>{transaction?.mobile}</td>
                        <td>{transaction?.recipient}</td>
                        <td>
                          {new Date(transaction.timestamp).toLocaleDateString()}
                        </td>
                        <td>৳ {transaction.amount.toFixed(2)}</td>
                        <td>
                          {(transaction.method === "send-money" && (
                            <p className="badge badge-warning rounded-none">
                              -৳ Send money
                            </p>
                          )) ||
                            (transaction.method === "cashout" && (
                              <p className="badge badge-warning bg-red-600 text-white rounded-none">
                                -৳ Cash Out
                              </p>
                            )) ||
                            (transaction.method === "cashin" && (
                              <p className="badge badge-warning rounded-none">
                                +৳ Cash In
                              </p>
                            ))}
                        </td>
                        <td>{transaction?.status}</td>
                        <td>
                          {transaction?.status === "pending" && (
                            <p>
                              <button
                                className="btn-sm border btn-warning bg-yellow-400"
                                onClick={() =>
                                  handleApproveCash(
                                    transaction._id,
                                    transaction.amount
                                  )
                                }
                              >
                                Approve
                              </button>
                              <button
                                className="btn-sm border text-white bg-red-800"
                                onClick={() =>
                                  handleDeclineCasin(transaction._id)
                                }
                              >
                                Decline
                              </button>
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  className="btn commonbtn btn-primary"
                  disabled={currentPageTransactions === 1}
                  onClick={() =>
                    setCurrentPageTransactions(currentPageTransactions - 1)
                  }
                >
                  Previous
                </button>
                <span>
                  Page {currentPageTransactions} of {transactionTotalPages}
                </span>
                <button
                  className="btn commonbtn btn-primary"
                  disabled={currentPageTransactions === transactionTotalPages}
                  onClick={() =>
                    setCurrentPageTransactions(currentPageTransactions + 1)
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  Overview
                </h3>
                <div className="text-xl  capitalize">
                  total system balance{" "}
                  <div className="badge font-bold rounded-none badge-warning text-xl">
                    {totalBalance.totalBalance}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row mb-6">
                <div className="w-full sm:w-1/2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={aggregatedTransactionData}
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
                <div className="w-full sm:w-1/2 mt-6 sm:mt-0">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={transactionsByMethod}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {transactionsByMethod.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </section>
    </div>
  );
};

export default AdminComponent;
