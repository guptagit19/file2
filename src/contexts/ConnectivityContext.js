// src/contexts/ConnectivityContext.js
import React, {createContext, useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

export const ConnectivityContext = createContext({isConnected: true});

export const ConnectivityProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ConnectivityContext.Provider value={{isConnected}}>
      {children}
    </ConnectivityContext.Provider>
  );
};
