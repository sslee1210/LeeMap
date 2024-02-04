import React from "react";
import home from "./Home.module.css";

function FavoriteCafes({
  favoriteCafes,
  cafeReviews,
  handleReviewChange,
  removeFavoriteCafe,
}) {
  const handleRemoveFavorite = (cafe) => {
    // removeFavoriteCafe 함수를 호출하여 카페를 즐겨찾기에서 삭제합니다.
    removeFavoriteCafe(cafe);
  };

  return (
    <div className={home.favoriteCafes}>
      <h2>찜한 카페</h2>
      <div className={home.favoritelist}>
        {favoriteCafes.map((cafe) => (
          <div key={cafe.id}>
            <h3>{cafe.place_name}</h3>
            <p>{cafe.address_name}</p>
            <textarea
              value={cafeReviews[cafe.id] || ""}
              onChange={(e) => handleReviewChange(cafe.id, e.target.value)}
              placeholder="이 카페의 특성을 평가해주세요."
            />
            {/* removeFavoriteCafe 함수를 호출하는 버튼을 추가합니다. */}
            <button onClick={() => handleRemoveFavorite(cafe)}>찜 해제</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoriteCafes;
