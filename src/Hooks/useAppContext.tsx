import { useContext } from "react";
import Context  from "../Context/SpinnerContext";

const useAppContext = () => {
  return useContext(Context);
};

export default useAppContext;
