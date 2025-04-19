import React, { createContext, useEffect, useState } from "react";
import type { Auth0UserProfile } from 'auth0-js';
import { UserContextType, UserProviderProps } from './types';

export const UserContext = createContext<UserContextType>({
  token: null,
  user: null,
  agency: null,
  isGetMatchedBtnClicked: false,
  setAgency: () => { },
  updateSession: () => { },
  setIsGetMatchedBtnClicked: () => { }
});

/**
 * Context Provider to handle User session { token, user }
 * @param children ReactNode
 * @returns UserContext.Provider
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [agency, setAgency] = useState<any | null>(null)
  const [token, setToken] = useState<string | null>(null);
  const [isGetMatchedBtnClicked, setIsGetMatchedBtnClicked] = useState(false)


  const updateSession = (token: string | null, user: Auth0UserProfile | null) => {
    setToken(token);
    setUser(user);
    if (token && user) {
      localStorage.setItem("token", `${token}`)
      localStorage.setItem("user", JSON.stringify(user))
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      updateSession(localStorage.getItem('token'), JSON.parse(localStorage.getItem('user') || "") || null)
    }
  }, [])

  useEffect(() => {
    console.log(isGetMatchedBtnClicked, "isGetMatchedBtnClicked");

  }, [isGetMatchedBtnClicked])



  return <UserContext.Provider value={{ user, agency, token, isGetMatchedBtnClicked, updateSession, setAgency, setIsGetMatchedBtnClicked }}>{children}</UserContext.Provider>;
};
