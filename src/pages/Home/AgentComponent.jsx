import React from "react";
import { Link } from "react-router-dom";
import SendMoneyForm from "../../components/SendMoneyForm";
import CashoutForm from "../../components/CashoutForm";
import useUser from '../../hooks/useUser'
const AgentComponent = () => {
  const user=useUser()
  return (
    <div className="">
      {/* Profile Card */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">{user.role} Dashboard</h2>
        <h2 className="text-2xl font-bold mb-4">
          Welcome {user.role},{user.name}
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
              {/* Open the modal using document.getElementById('ID').showModal() method */}
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
                      {/* if there is a button in form, it will close the modal */}
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
                      {/* if there is a button in form, it will close the modal */}
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
                  document.getElementById("my_modal_1").showModal()
                }
              >
                Cash IN
              </button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Hello!</h3>
                  <p className="py-4">
                    Press ESC key or click the button below to close
                  </p>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </li>
          </ul>
        </div>
      </div>
      
    </div>
  );
};

export default AgentComponent;
