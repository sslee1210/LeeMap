import React, { useState } from "react";
import home from "./Home.module.css";

function CafeList({ cafes, selectCafe, favoriteCafes, addFavoriteCafe }) {
  return (
    <div className={home.cafelists}>
      {cafes.map((cafe) => (
        <div key={cafe.id} onClick={() => selectCafe(cafe)}>
          <h2>{cafe.place_name}</h2>
          <p>{cafe.address_name}</p>
          <a
            href={`http://map.kakao.com/link/to/${cafe.place_name},${cafe.y},${cafe.x}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            길찾기
          </a>
          <FavoriteButton cafe={cafe} addFavoriteCafe={addFavoriteCafe} />
        </div>
      ))}
    </div>
  );
}

function FavoriteButton({ cafe, addFavoriteCafe }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    addFavoriteCafe(cafe);
  };

  return (
    <button onClick={handleFavoriteClick}>{isFavorited ? "❤️" : "🤍"}</button>
  );
}

export default CafeList;
