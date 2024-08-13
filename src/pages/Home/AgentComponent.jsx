import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SendMoneyForm from "../../components/SendMoneyForm";
import CashoutForm from "../../components/CashoutForm";
import useUser from "../../hooks/useUser";
import CashinForm from "../../components/CashinForm";
import toast from "react-hot-toast";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Profile from "../../components/Profile";

const AgentComponent = () => {
  const [transaction, setTransaction] = useState([]);
  const user = useUser();
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/transactions-agent/${user.mobile}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }

        const data = await response.json();

        const sortedTransactions = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setTransaction(sortedTransactions);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [user.mobile]);

  const latestTransaction = transaction[0];

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
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="mb-6 flex flex-col sm:flex-row  sm:justify-between items-center">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">
          {user.role} Dashboard
        </h2>
        <h2 className="text-2xl font-bold">
          Welcome {user.role}, {user.name}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
          {user ? (
            <>
              <p className="text-gray-600 mb-2">Name: {user.name}</p>
              <p className="text-gray-600 mb-2">Email: {user.email}</p>
              <p className="text-gray-600 mb-2">Mobile Number: {user.mobile}</p>
              <Link
                onClick={() => document.getElementById("profile").showModal()}
                className="btn rounded-none bg-transparent border-none shadow-md mt-4 text-primary"
              >
                View Profile
              </Link>
              <dialog
                id="profile"
                className="modal lg:modal-bottom sm:modal-middle"
              >
                <div className="modal-box relative">
                  <Profile />
                  <div className="modal-action absolute top-4 right-4 m-0 p-0">
                    <form method="dialog">
                      <button className="font-bold">X</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </>
          ) : (
            <p>Loading profile information...</p>
          )}
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Account Balance</h2>
          <p className="text-4xl font-bold text-blue-600">
            {user?.role === "pending"
              ? "Your Registration is under review"
              : `৳ ${user.balance}`}
          </p>
          <div className="mt-4">
            {latestTransaction ? (
              <div
                key={latestTransaction._id}
                className={
                  latestTransaction?.status === "declined"
                    ? "border bg-error p-4 mb-4 relative shadow shadow-gray-400"
                    : "border p-4 mb-4 relative shadow shadow-gray-400"
                }
              >
                {(latestTransaction.method === "send-money" && (
                  <p className="badge badge-warning rounded-none absolute top-0 right-0">
                    -৳ Send money
                  </p>
                )) ||
                  (latestTransaction.method === "cashout" && (
                    <p className="badge badge-warning rounded-none absolute top-0 right-0">
                      +৳ Cash Out
                    </p>
                  )) ||
                  (latestTransaction.method === "cashin" && (
                    <p className="badge badge-warning rounded-none absolute top-0 right-0">
                      -৳ Cash In
                    </p>
                  ))}
                <>
                  {(latestTransaction.status === "pending" && (
                    <>
                      <p className="absolute right-0 top-5 badge  animate-pulse badge-error rounded-none">
                        pending request
                      </p>
                    </>
                  )) ||
                    (latestTransaction.status === "declined" && (
                      <>
                        <p className="absolute right-0 top-5 badge badge-warning rounded-none shadow">
                          Request rejected
                        </p>
                      </>
                    ))}
                </>
                <h2>Last Transaction</h2>
                <p>Transaction ID: {latestTransaction._id}</p>
                <p>Amount: {latestTransaction.amount}</p>
                <p>Sender: {latestTransaction.mobile}</p>
                <p>
                  Date: {new Date(latestTransaction.timestamp).toLocaleString()}
                </p>
                {latestTransaction.status === "pending" && (
                  <p>
                    <button
                      className="btn-sm border btn-warning bg-yellow-400"
                      onClick={() =>
                        handleApproveCash(
                          latestTransaction._id,
                          latestTransaction.amount
                        )
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="btn-sm border text-white bg-red-800"
                      onClick={() => handleDeclineCasin(latestTransaction._id)}
                    >
                      Decline
                    </button>
                  </p>
                )}
              </div>
            ) : (
              <p>No transactions available</p>
            )}
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <ul className="space-y-2">
            <li>
              <button
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                Pay Bill
              </button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  {/* <SendMoneyForm /> */}
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </li>
            <li>
              <button
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() =>
                  document.getElementById("my_modal_cashin").showModal()
                }
              >
                Cash In
              </button>
              <dialog id="my_modal_cashin" className="modal">
                <div className="modal-box">
                  <CashinForm />
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </li>
          </ul>

          <div className="mt-4">
            {latestTransaction ? (
              <div
                key={latestTransaction._id}
                className="border p-4 mb-4 relative shadow shadow-gray-400"
              >
                {(latestTransaction.method === "send-money" && (
                  <p className="badge badge-warning rounded-none absolute top-0 right-0">
                    -৳ Send money
                  </p>
                )) ||
                  (latestTransaction.method === "cashout" && (
                    <p className="badge badge-warning rounded-none absolute top-0 right-0">
                      +৳ Cash Out
                    </p>
                  )) ||
                  (latestTransaction.method === "cashin" && (
                    <p className="badge badge-warning rounded-none absolute top-0 right-0">
                      -৳ Cash In
                    </p>
                  ))}
                <>
                  {(latestTransaction.status === "pending" && (
                    <>
                      <p className="absolute right-0 top-5 badge  animate-pulse badge-error rounded-none">
                        pending request
                      </p>
                    </>
                  )) ||
                    (latestTransaction.status === "declined" && (
                      <>
                        <p className="absolute right-0 top-5 badge badge-warning rounded-none shadow">
                          Request rejected
                        </p>
                      </>
                    ))}
                </>
                <h2>Last Transaction</h2>
                <p>Transaction ID: {latestTransaction._id}</p>
                <p>Amount: ৳ {latestTransaction.amount}</p>
                <p>Sender: {latestTransaction.mobile}</p>
                <p>
                  Date: {new Date(latestTransaction.timestamp).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>No transactions available</p>
            )}
          </div>

          <div className="mt-4">
            <button
              className="btn rounded-none bg-transparent border-none shadow-md"
              onClick={() =>
                document.getElementById("my_modal_trx").showModal()
              }
            >
              ৳ View All Transactions
            </button>
            <dialog id="my_modal_trx" className="modal">
              <div className="modal-box">
              {transaction.map((trx) => (
                  <div
                    key={trx._id}
                    className={
                      trx.status === "declined"
                        ? "bg-red-900 text-white mb-2 p-4 rounded relative"
                        : "bg-gray-300 mb-2 p-4 text-black rounded relative"
                    }
                  >
                    {trx?.status === "declined" ? (
                      <p className="badge badge-warning rounded-none absolute top-6 right-0">
                        X৳ request rejected.
                      </p>
                    ) : (
                      ""
                    )}
                    <p className={trx?.status === "declined" ? "hidden" : ""}>
                      Transaction ID: {trx._id}
                    </p>
                    <p>Amount: ৳ {trx.amount}</p>
                    <p>Receiver: {trx.recipient}</p>
                    <p>Date: {new Date(trx.timestamp).toLocaleString()}</p>
                    <div className="absolute top-0 right-0">
                      {(trx.method === "send-money" && (
                        <p className="badge badge-warning rounded-none">
                          -৳ Send money
                        </p>
                      )) ||
                        (trx.method === "cashout" && (
                          <p className="badge badge-warning rounded-none">
                            -৳ Cash Out
                          </p>
                        )) ||
                        (trx.method === "cashin" && (
                          <p className="badge badge-warning rounded-none">
                            +৳ Cash In
                          </p>
                        ))}
                    </div>
                  </div>
                ))}

                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentComponent;
