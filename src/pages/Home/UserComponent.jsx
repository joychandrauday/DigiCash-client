import React from "react";
import { Link } from "react-router-dom";

const UserComponent = ({ user }) => {
  return (
    <div className="">
      {/* Profile Card */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">{user.role} Dashboard</h2>
        <h2 className="text-2xl font-bold mb-4">Welcome {user.role},{user.name}</h2>
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
            {user?.role === 'pending'
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
    </div>
  );
};

export default UserComponent;
