import { useState, createContext } from "react";

export const ThemeContext = createContext({});

// eslint-disable-next-line react/prop-types
export default function ThemeProvider({ children }) {
  const [sidebarDesktopOpen, setSidebarDesktopOpen] = useState(true);
  const [sidebarName, setSidebarName] = useState("Dashboard");
    
  return (
    <ThemeProvider.Provider
      value={{
        sidebarName, 
        setSidebarName,
        sidebarDesktopOpen,
        setSidebarDesktopOpen
      }}
    >
      {children}
    </ThemeProvider.Provider>
  );
}


