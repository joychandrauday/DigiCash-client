import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from './useAxiosPublic';

const apiLink= import.meta.env.VITE_API_URL
const useAdmin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state for user data fetch
  const axiosSecure = useAxiosPublic();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiLink}/user`, {
          method: "GET",
          credentials: "include", // Use 'credentials' instead of 'withCredentials'
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchUser();
  }, []);

  const { data: isAdmin, isPending: isAdminLoading, error } = useQuery({
    queryKey: [user?.email, "isAdmin"],
    enabled: !loading && !!localStorage.getItem('access-token'), 
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/admin/${user.email}`);
      return res.data?.admin;
    },
    onError: (err) => {
      console.error("Error fetching admin data:", err);
    },
  });

  if (loading) {
    <p>loading admin status...</p>
  } else if (error) {
    console.error("Error during admin check:", error);
  } else {
    <p>Admin check complete</p>
  }

  return [isAdmin, isAdminLoading, loading];
};

export default useAdmin;
