import React, { createContext, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUser } from "./Database"

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  const auth = getAuth();
  onAuthStateChanged(auth, (usr) => {
    if (usr) {
      getUser(usr).then((user) => setUser(user));
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
