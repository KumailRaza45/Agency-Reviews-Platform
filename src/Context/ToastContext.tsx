// src/contexts/ToastContext.tsx
import React, { createContext, useState,ReactNode } from 'react';

interface ToastContextType {
  toastMessage: string;
  toastType:string;
  showToast: (message: string,type:string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType>({
  toastMessage: '',
  toastType:'',
  showToast: () => {},
  hideToast: () => {},
});
interface ToastProviderProps {
    children: ReactNode; // Define children prop explicitly
  }
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, settoastType] = useState<string>('');

  const showToast = (message: string,type:string) => {
    setToastMessage(message);
    settoastType(type);
  }

  const hideToast = () => {
    setToastMessage('');
    settoastType('');
  };

  return (
    <ToastContext.Provider value={{ toastMessage,toastType,showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;
