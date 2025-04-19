import { ReactNode, Dispatch, SetStateAction } from "react";
import type { Auth0UserProfile } from "auth0-js";

export interface UserContextType {
  token: string | null;
  user: Auth0UserProfile | null;
  agency: any | null;
  isGetMatchedBtnClicked: boolean;
  setAgency: Dispatch<SetStateAction<any>>;
  updateSession: (token: string | null, user: Auth0UserProfile | null) => void;
  setIsGetMatchedBtnClicked: Dispatch<SetStateAction<any>>;
}

export interface UserProviderProps {
  children: ReactNode;
}
