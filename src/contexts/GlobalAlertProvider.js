// src/contexts/GlobalAlertContext.js
import React, {createContext, useState, useCallback, useContext} from 'react';
import GlobalAlertBanner from '../components/Global/GlobalAlertBanner';
const GlobalAlertContext = createContext();

export const useGlobalAlert = () => useContext(GlobalAlertContext);

export const GlobalAlertProvider = ({children}) => {
  const [alertConfig, setAlertConfig] = useState(null);

  const showAlert = useCallback(config => {
    setAlertConfig({...config, visible: true});
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig(null);
  }, []);

  return (
    <GlobalAlertContext.Provider value={{showAlert, hideAlert}}>
      {children}
      {alertConfig?.visible && (
        <GlobalAlertBanner
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          iconName={alertConfig.iconName}
          onCancel={() => {
            alertConfig.onCancel?.();
            hideAlert();
          }}
          onConfirm={() => {
            alertConfig.onConfirm?.();
            hideAlert();
          }}
        />
      )}
    </GlobalAlertContext.Provider>
  );
};
