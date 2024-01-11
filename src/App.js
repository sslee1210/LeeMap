import React, { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import CafeContext from "./components/CafeContext";

const App = () => {
  const [selectedCafe, setSelectedCafe] = useState(null);

  return (
    <CafeContext.Provider value={{ selectedCafe, setSelectedCafe }}>
      <Home />
    </CafeContext.Provider>
  );
};

export default App;
