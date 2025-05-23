import React, {createContext, useState, useCallback, useContext} from 'react';
import GlobalAlertBanner from '../components/Global/GlobalAlertBanner';

const GlobalAlertContext = createContext();

export const GlobalAlertProvider = ({children}) => {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback(options => {
    setAlert({...options, visible: true});
    if (options.autoHide !== false) {
      setTimeout(() => setAlert(null), options.duration || 4000);
    }
  }, []);

  const hideAlert = useCallback(() => setAlert(null), []);

  return (
    <GlobalAlertContext.Provider value={{showAlert, hideAlert}}>
      {children}
      {/* Alert UI */}
      {alert?.visible && <GlobalAlertBanner {...alert} onClose={hideAlert} />}
    </GlobalAlertContext.Provider>
  );
};

export const useGlobalAlert = () => useContext(GlobalAlertContext);
