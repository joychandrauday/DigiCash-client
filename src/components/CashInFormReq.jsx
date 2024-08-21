import React, { useState, useEffect } from "react";
import useUser from "../hooks/useUser";
import useAxiosPublic from "../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import useAgent from "../hooks/useAgents";

const apiLink= import.meta.env.VITE_API_URL
const CashinFormReq = () => {
  const [amount, setAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [jwt, setJwt] = useState(""); // Assuming you have JWT stored in your state or context
  const [isRecipientValid, setIsRecipientValid] = useState(false);
  const user = useUser();
  const axiosPublic = useAxiosPublic();
  const agents = useAgent();

  useEffect(() => {
    // Fetch JWT token if not already fetched
    // Assuming you have a function or context to get JWT token
    const fetchJwt = async () => {
      const token = await getJwtToken(); // Replace with your JWT fetching logic
      setJwt(token);
    };

    fetchJwt();
  }, []);

  const handleAmountChange = (e) => {
    const amountValue = parseFloat(e.target.value);
    setAmount(amountValue);
    setTotalAmount(amountValue);
  };

  const handleRecipientChange = async (e) => {
    const selectedRecipient = e.target.value;
    setRecipient(selectedRecipient);

    if (selectedRecipient) {
      try {
        const response = await fetch(
          `${apiLink}/user/${selectedRecipient}`,
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
      method: "cashin", // Specify the method
    };

    try {
      const res = await axiosPublic.post("/cashin-request", transactionData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (res.data) {
        toast.success("Wait for agent approval...");
        // Use window.location.reload() or a more React-friendly way
        // like updating the state or using history.push to redirect
        window.location.reload();
      } else {
        toast.error("Transaction failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
      toast.error("Something went wrong");
    }

    // Reset form fields
    setAmount("");
    setRecipient("");
    setPin("");
    setIsRecipientValid(false);
    setTotalAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Cash In Request</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipient">
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
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
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
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pin">
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
      <button type="submit" className="btn btn-primary w-full" disabled={!isRecipientValid}>
        Send Money
      </button>
    </form>
  );
};

export default CashinFormReq;

// Dummy function to simulate JWT fetching. Replace with actual implementation.
const getJwtToken = async () => {
  return "your-jwt-token";
};
