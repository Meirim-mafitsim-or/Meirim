import React, { createContext, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  const auth = getAuth();
  onAuthStateChanged(auth, (usr) => {
    if (usr) {
      setUser(usr);
    } else {
      // User is signed out
      setUser(null);
    }
  });

  const logout = () => {
      auth.signOut();
    }

  return (
    <UserContext.Provider value={{ user, logout }}>
      {children}
    </UserContext.Provider>
  );
};



