import React, { createContext, useState ,ReactNode} from 'react';

interface SpinnerContextType {
  isLoading: boolean;
  showSpinner: () => void;
  hideSpinner: () => void;
}

const SpinnerContext = createContext<SpinnerContextType>({
  isLoading: false,
  showSpinner: () => {},
  hideSpinner: () => {},
});
interface SpinnerProviderProps {
  children: ReactNode; // Define children prop explicitly
}

export const SpinnerProvider: React.FC<SpinnerProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showSpinner = () => {
    setIsLoading(true);
  };

  const hideSpinner = () => {
    setIsLoading(false);
  };

  return (
    <SpinnerContext.Provider value={{ isLoading, showSpinner, hideSpinner }}>
      {children}
    </SpinnerContext.Provider>
  );
};

export default SpinnerContext;