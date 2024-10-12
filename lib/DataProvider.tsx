// @ts-nocheck
import React, { useState, useEffect, useContext, createContext, ReactNode } from "react";

interface DataContextType {
  posUser: any;
  loading: boolean; 
  accessToken: string | null;
  setAuthData: any;
  setLoading: (value: boolean) => void;
  signOut: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [posUser, setPosUser] = useState<any | null>(null);

  const [loading, setLoading] = useState(true); // Set to false when pos user signed in
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
      setLoading(true);
      let dataItem = localStorage.getItem('data');
      console.log(dataItem);
      if(dataItem) {
        dataItem = JSON.parse(dataItem);
        setAuthData(dataItem.user, dataItem.token);
      } else {
        console.log('no user saved in localstorage');
      }   
      
      setLoading(false);
  }, []);

  const setAuthData = (posUser: any, token: any) => {
    setPosUser(posUser);
    setAccessToken(token);
    setLoading(false);

  }

  const signOut = () => {
    setPosUser(null);
    setAccessToken(null);
    setLoading(false);
    localStorage.removeItem('data');
  }

  return (
    <DataContext.Provider value={{ posUser, loading, accessToken, setAuthData, setLoading, signOut}}>
      {children}
    </DataContext.Provider>
  );
};
