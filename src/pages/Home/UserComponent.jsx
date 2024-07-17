import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SendMoneyForm from "../../components/SendMoneyForm";
import CashoutForm from "../../components/CashoutForm";
import useUser from "../../hooks/useUser";
import CashinFormReq from "../../components/CashInFormReq";

const UserComponent = () => {
  const [transaction, setTransaction] = useState([]);
  const user = useUser();
  console.log(transaction);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/transactions/${user.mobile}`,
          {
            method: "GET",
            credentials: "include", // Use 'credentials' instead of 'withCredentials'
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
        console.log("Fetched user data:", data);

        // Sort the transactions by timestamp in descending order
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

  return (
    <div className="">
      {/* Profile Card */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">{user.role} Dashboard</h2>
        <h2 className="text-2xl font-bold mb-4">
          Welcome {user.role}, {user.name}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
          {user ? (
            <>
              <p className="text-gray-600 mb-2">Name: {user.name}</p>
              <p className="text-gray-600 mb-2">Email: {user.email}</p>
              <p className="text-gray-600 mb-2">Mobile Number: {user.mobile}</p>
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
          <p className="text-4xl font-bold text-blue-600">
            {user?.role === "pending"
              ? "Your Registration is in under review"
              : `৳ ${user.balance}`}
          </p>
          <div>
            {latestTransaction ? (
              <div key={latestTransaction._id} className="border p-4 mb-4">
                {latestTransaction.method === 'send-money' && (
                  <p className="badge badge-warning rounded-none">-৳ Send money</p>
                ) || latestTransaction.method === 'cashout' && (
                  <p className="badge badge-warning rounded-none">-৳ Cash Out</p>
                ) || latestTransaction.method === 'cashin' && (
                  <p className="badge badge-warning rounded-none">+৳ Cash In</p>
                )}
                <h2>Last Transaction</h2>
                <p>Transaction ID: {latestTransaction._id}</p>
                <p>Amount: {latestTransaction.amount}</p>
                <p>Receiver: {latestTransaction.recipient}</p>
                <p>
                  Date: {new Date(latestTransaction.timestamp).toLocaleString()}
                </p>
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
                Send Money
              </button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <SendMoneyForm />
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
                  document.getElementById("my_modal_2").showModal()
                }
              >
                Cash Out
              </button>
              <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                  <CashoutForm />
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
                Cash IN
              </button>
              <dialog id="my_modal_cashin" className="modal">
                <div className="modal-box">
                  <CashinFormReq />
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </li>
          </ul>
          <div className="">
            <button
              className="btn rounded-none bg-transparent border-none shadow-md mt-4"
              onClick={() => document.getElementById("my_modal_trx").showModal()}
            >
              ৳ View all Transactions
            </button>
            <dialog id="my_modal_trx" className="modal">
              <div className="modal-box">
                {transaction.map((trx) => (
                  <div
                    key={trx._id}
                    className="bg-gray-300 mb-2 p-4 text-black rounded relative"
                  >
                    <p>Transaction ID: {trx._id}</p>
                    <p>Amount: ৳ {trx.amount}</p>
                    <p>Receiver: {trx.recipient}</p>
                    <p>Date: {new Date(trx.timestamp).toLocaleString()}</p>
                    <div className="absolute top-0 right-0">
                      {trx.method === 'send-money' && (
                        <p className="badge badge-warning rounded-none">-৳ Send money</p>
                      ) || trx.method === 'cashout' && (
                        <p className="badge badge-warning rounded-none">-৳ Cash Out</p>
                      ) || trx.method === 'cashin' && (
                        <p className="badge badge-warning rounded-none">+৳ Cash In</p>
                      )}
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

export default UserComponent;
