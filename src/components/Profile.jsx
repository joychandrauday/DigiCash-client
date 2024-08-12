import React from "react";
import useUser from "../hooks/useUser";

const Profile = () => {
  const user = useUser();
  console.log(user?.image_url);
  return (
    <div className="text-center">
      <div className="avatar ">
        <div className=" ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
          <img src={user?.image_url ? `${user?.image_url}`:'https://thumbs.dreamstime.com/b/generic-person-gray-photo-placeholder-man-silhouette-white-background-144511705.jpg'} />
        </div>
      </div>
      <div className="wrap space-y-1 mt-4">
        <h1 className="font-bold text-xl">{user?.name}</h1>
        <p>{user?.email}</p>
        <p>{user?.mobile}</p>
        <p>total balance: ৳ {user?.balance}</p>
      </div>
    </div>
  );
};

export default Profile;
