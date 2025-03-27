import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [slide, setSlide] = useState("true"); 

  const toggleTheme = () => {
    setSlide((prevSlide) => (prevSlide === "true" ? "false" : "true"));
  };

  return (
    <ThemeContext.Provider value={{ slide, toggleTheme }}>  {/* ✅ Fixed */}
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
