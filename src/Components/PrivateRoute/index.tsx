import React, { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { PrivateRouteProps } from "./types";

/**
 * Wrapper route to be used if you want to restrict a view for authenticated users
 * Redirects to agancy login view if token is not set in local context
 * @param children ReactNode
 * @returns ReactNode
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token } = useContext(UserContext);
  const navigate = useNavigate();

  if (token === null || token === "") {
    navigate("/");
  }
  return <>{children}</>;
};

export default PrivateRoute;
