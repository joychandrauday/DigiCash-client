import React from "react";
import useUser from "../hooks/useUser";

const Profile = () => {
  const { user } = useUser();
  console.log(user);
  return (
    <div>
      <div className="avatar">
        <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
          <img src={user?.image} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
