import React, { useState, useEffect } from "react";
import useUser from "../hooks/useUser";
import useAxiosPublic from "../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import useAgent from "../hooks/useAgents";

const CashoutForm = () => {
  const [amount, setAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [jwt, setJwt] = useState(""); // Assuming you have JWT stored in your state or context
  const [isRecipientValid, setIsRecipientValid] = useState(false);
  const user = useUser();
  const axiosPublic = useAxiosPublic();
  const agents = useAgent(); // Fetch the agents

  // Calculate the total amount with fee
  const handleAmountChange = (e) => {
    const amountValue = parseFloat(e.target.value);
    setAmount(amountValue);
    const fee = amountValue * 0.015;
    const totalAmountValue = amountValue + fee;
    setAmount(amountValue);
    setTotalAmount(totalAmountValue.toFixed(2));
  };

  const handleRecipientChange = async (e) => {
    const selectedRecipient = e.target.value;
    setRecipient(selectedRecipient);

    if (selectedRecipient) {
      try {
        const response = await fetch(
          `https://digi-cash-server.vercel.app/user/${selectedRecipient}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`, // JWT token for verification
            },
          }
        );

        if (response.ok) {
          setIsRecipientValid(true);
          setError(""); // Clear any previous error
        } else {
          setIsRecipientValid(false);
          setError("Recipient does not exist.");
        }
      } catch (error) {
        console.error("Error checking recipient:", error);
        setIsRecipientValid(false);
        setError("Error checking recipient.");
      }
    } else {
      setIsRecipientValid(false);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the transaction amount
    if (amount < 50) {
      setError("Transaction amount must be at least 50 Taka.");
      return;
    }
    if (amount >  user.balance) {
      setError("you do not have enough");
      return;
    }

    if (!isRecipientValid) {
      setError("Invalid recipient. Please check the recipient's username.");
      return;
    }
    // Gather all data in an object
    const transactionData = {
      mobile: user?.mobile,
      recipient,
      amount,
      pin,
      totalAmount,
      method: "cashout",
    };

    axiosPublic
      .post("/transactions", transactionData, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          toast.success("Transaction successful...");
        } else {
          toast.error("Transaction failed. Please check your credentials."); // Notify user if login fails
        }
      })
      .catch((error) => {
        toast.error("Something went wrong");
        console.error(error);
      });

    setAmount("");
    setRecipient("");
    setPin("");
    setIsRecipientValid(false);
    setTotalAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Cash Out</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="recipient"
        >
          Select an Agent Number
        </label>
        <select
          id="recipient"
          name="recipient"
          value={recipient}
          onChange={handleRecipientChange}
          required
          className="input input-bordered w-full"
        >
          <option value="">Select an Agent</option>
          {agents.map((agent) => (
            <option key={agent.mobile} value={agent.mobile}>
              {agent.name} - {agent.mobile}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amount"
        >
          Amount (Taka)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={amount}
          onChange={handleAmountChange}
          required
          min="50"
          className="input input-bordered w-full"
        />
        {amount && (
          <p className="text-sm text-gray-700 mt-2">
            Total Amount (including fees): {totalAmount} Taka
          </p>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="pin"
        >
          PIN
        </label>
        <input
          type="password"
          id="pin"
          name="pin"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
          className="input input-bordered w-full"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={!isRecipientValid}
      >
        Send Money
      </button>
    </form>
  );
};

export default CashoutForm;
