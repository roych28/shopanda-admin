

// @ts-nocheck
import React, { useState, useEffect, useContext, createContext, ReactNode } from "react";

interface DataContextType {
  posUser: any;
  loading: boolean; 
  accessToken: string | null;
  setAuthData: any;
  setLoading: (value: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};
/*
const fetchCustomerData = async (user: User, token: string) => {
  try {
    const response = await fetch(`${SERVER_API_BASE_URL}/api/customer/get/${user.uid}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Customer not found");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch customer data");
      }
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error fetching customer data: ${error.message}`);
    throw error;
  }
};

const createCustomer = async (user: User, token: string) => {
  try {
    const response = await fetch(`${SERVER_API_BASE_URL}/api/customer/create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        // Add other customer details as needed
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create customer");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error creating customer: ${error.message}`);
    throw error;
  }
};*/

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
      
      
  }, []);

  const setAuthData = (posUser: any, token: any) => {
    setPosUser(posUser);
    setAccessToken(token);
    setLoading(false);

  }

  return (
    <DataContext.Provider value={{ posUser, loading, accessToken, setAuthData, setLoading}}>
      {children}
    </DataContext.Provider>
  );
};
