import React from "react";
import home from "./Home.module.css";
function CafeList({
  cafes,
  selectCafe,
  favoriteCafes,
  addFavoriteCafe,
  removeFavoriteCafe,
}) {
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (favoriteCafes.some((favCafe) => favCafe.id === cafe.id)) {
                removeFavoriteCafe(cafe);
              } else {
                addFavoriteCafe(cafe);
              }
            }}
          >
            {favoriteCafes.some((favCafe) => favCafe.id === cafe.id)
              ? "찜 해제"
              : "찜하기"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default CafeList;
