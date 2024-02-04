// CafeContext.js
import React from "react";

const CafeContext = React.createContext({
  selectedCafe: null,
  setSelectedCafe: () => {},
  favoriteCafes: [],
  setFavoriteCafes: () => {},
  cafeReviews: {},
  setCafeReviews: () => {},
});

export default CafeContext;
