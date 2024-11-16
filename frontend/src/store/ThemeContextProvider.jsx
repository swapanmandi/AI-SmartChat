import React, { createContext } from "react";

const themeContext = createContext();

function ThemeContextProvider({ children }) {
  return (
    <>
      <themeContext.Provider value={{}}>{children}</themeContext.Provider>
    </>
  );
}

export { themeContext, ThemeContextProvider };
