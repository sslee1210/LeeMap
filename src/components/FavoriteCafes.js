import React from "react";
import home from "./Home.module.css";

function FavoriteCafes({ favoriteCafes, cafeReviews, handleReviewChange }) {
  return (
    <div className={home.favoriteCafes}>
      <h2>찜한 카페</h2>
      {favoriteCafes.map((cafe) => (
        <div key={cafe.id}>
          <h3>{cafe.place_name}</h3>
          <p>{cafe.address_name}</p>
          <textarea
            value={cafeReviews[cafe.id] || ""}
            onChange={(e) => handleReviewChange(cafe.id, e.target.value)}
            placeholder="이 카페의 특성을 평가해주세요."
          />
        </div>
      ))}
    </div>
  );
}

export default FavoriteCafes;
