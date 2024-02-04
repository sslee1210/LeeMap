import React, { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import CafeContext from "./components/CafeContext";

const App = () => {
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [favoriteCafes, setFavoriteCafes] = useState([]);
  const [cafeReviews, setCafeReviews] = useState({}); // 사용자 리뷰를 저장할 상태를 추가

  return (
    <CafeContext.Provider
      value={{
        selectedCafe,
        setSelectedCafe,
        favoriteCafes,
        setFavoriteCafes,
        cafeReviews,
        setCafeReviews,
      }}
    >
      <Home />
    </CafeContext.Provider>
  );
};

export default App;
