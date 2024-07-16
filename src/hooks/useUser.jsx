import React, { useEffect, useState } from 'react';

const useUser = () => {
    const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/user", {
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
        console.log("Fetched user data:", data); // Log fetched data
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);
    return user;
};

export default useUser;