import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  //Check auth  
  const checkAuth = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/is-auth`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.isAuth) {
        setIsLoggedIn(true);
        getUserData();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
      console.error(error);
    }
  };


  //Fetch User Data
 const getUserData = async () => {
  try {
    const response = await fetch(`${backendUrl}/api/user/data`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (data.userData) {
      setUserData(data.userData);
    } else {
      setUserData(null);
    }

  } catch (error) {
    setUserData(null);
    console.error(error);
  }
};
 

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    checkAuth
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
