import React, { useEffect, useState } from 'react';

const useAgent = () => {
    const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("http://localhost:8000/users/agent", {
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
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchAgents();
  }, []);
    return user;
};

export default useAgent;