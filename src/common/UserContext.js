import React, {createContext , useState} from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState();
    const changeUser = (newUser) => {
      setUser(newUser);
    };
  
    return (
      <UserContext.Provider value={{ user, changeUser }}>
        {children}
      </UserContext.Provider>
    );
  };



