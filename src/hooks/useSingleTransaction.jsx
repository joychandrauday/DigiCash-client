import React, { useEffect, useState } from 'react';

const apiLink= import.meta.env.VITE_API_URL
const useSingleTransaction = ({user}) => {
    const [transictions, setTransaction] = useState([]);
    
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiLink}/transactions/${user.mobile}`, {
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
        setTransaction(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);
    return transictions;
};

export default useSingleTransaction;