import React, { useContext } from "react";
import { Context } from "../main";
import Loader from "../components/Loader";
import './Profile.css';;

const Profile = () => {
  const { isAuthenticated, loading, user } = useContext(Context);

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page"> {/* Added wrapper div */}
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
};

export default Profile;
