import React, { useContext, useEffect } from "react";
import { UserContext } from "../Context/UserContext";
import auth0JS from "auth0-js";
import SpinnerContext from "../Context/SpinnerContext";

const UserLogout: React.FC = () => {
  const { isLoading, showSpinner } = useContext(SpinnerContext);
  const { updateSession } = useContext(UserContext);

  useEffect(() => {
    updateSession(null, null);

    const auth0 = new auth0JS.WebAuth({
      domain: process.env.REACT_APP_AUTH_DOMAIN || "",
      clientID: process.env.REACT_APP_AUTH_CLIENT_ID || "",
    });

    auth0.logout({
      returnTo: process.env.REACT_APP_AGENCY_LOGIN,
      clientID: process.env.REACT_APP_AUTH_CLIENT_ID || "",
    });
  }, []);

  return (
    <>
      { isLoading ? showSpinner() : null }
    </>
  );
};

export default UserLogout;
