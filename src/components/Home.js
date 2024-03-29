import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import CafeContext from "./CafeContext";
import home from "./Home.module.css";
import CafeList from "./CafeList";
import FavoriteCafes from "./FavoriteCafes";

function Home() {
  const {
    selectedCafe,
    setSelectedCafe,
    favoriteCafes,
    setFavoriteCafes,
    cafeReviews,
    setCafeReviews,
  } = useContext(CafeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [cafes, setCafes] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 36.5811, lng: 127.9783 });
  const [map, setMap] = useState(null);
  const [showFavoriteCafes, setShowFavoriteCafes] = useState(false);
  const selectedMarkerRef = useRef(null);
  const originalImageRef = useRef(null);
  const infowindowRef = useRef(null);
  const markerRefs = useRef({});

  const handleReviewChange = (cafeId, review) => {
    setCafeReviews((prevReviews) => ({
      ...prevReviews,
      [cafeId]: review,
    }));
  };

  const addFavoriteCafe = (cafe) => {
    setFavoriteCafes((prevFavCafes) => [...prevFavCafes, cafe]);
  };

  const removeFavoriteCafe = (cafe) => {
    setFavoriteCafes((prevFavCafes) =>
      prevFavCafes.filter((favCafe) => favCafe.id !== cafe.id)
    );
  };

  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCenter(userLocation);

        if (map) {
          const moveLatLng = new window.kakao.maps.LatLng(
            userLocation.lat,
            userLocation.lng
          );
          map.setCenter(moveLatLng);
        }
      });
    } else {
      console.error("Error: Your browser doesn't support geolocation.");
    }
  };

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      let mapContainer = document.getElementById("map");

      const initMap = () => {
        const options = {
          center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
          level: 5,
        };

        const mapInit = new window.kakao.maps.Map(mapContainer, options);
        setMap(mapInit);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setMapCenter(userLocation);
            initMap();
          },
          () => {
            console.error("Error: The Geolocation service failed.");
            initMap();
          }
        );
      } else {
        console.error("Error: Your browser doesn't support geolocation.");
        initMap();
      }
    }
  }, []);

  const searchCafes = () => {
    if (infowindowRef.current) {
      infowindowRef.current.close();
    }

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setImage(originalImageRef.current);
    }

    selectedMarkerRef.current = null;
    infowindowRef.current = null;
    setSelectedCafe(null);
    if (window.kakao && window.kakao.maps) {
      for (let id in markerRefs.current) {
        markerRefs.current[id].setMap(null);
      }
      markerRefs.current = {};

      const API_KEY = "34c1bf4fb787d8d21997bed10d5f165e";
      const bounds = map.getBounds();
      const swLatLng = bounds.getSouthWest();
      const neLatLng = bounds.getNorthEast();

      axios
        .get(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=coffee+${searchTerm}&y=${
            mapCenter.lat
          }&x=${
            mapCenter.lng
          }&rect=${swLatLng.getLng()},${swLatLng.getLat()},${neLatLng.getLng()},${neLatLng.getLat()}`,
          {
            headers: { Authorization: `KakaoAK ${API_KEY}` },
          }
        )
        .then((response) => {
          if (response.data.documents) {
            const cafes = response.data.documents;
            setCafes(cafes);
            cafes.forEach((cafe) => {
              var markerPosition = new window.kakao.maps.LatLng(cafe.y, cafe.x);
              var marker = new window.kakao.maps.Marker({
                position: markerPosition,
              });
              marker.setMap(map);

              window.kakao.maps.event.addListener(marker, "click", function () {
                selectMarker(marker, cafe);
              });

              markerRefs.current[cafe.id] = marker;
            });
          }
        })
        .catch((error) => console.error("Error:", error));

      window.kakao.maps.event.addListener(map, "center_changed", function () {
        const center = map.getCenter();
        setMapCenter({ lat: center.getLat(), lng: center.getLng() });
      });
    }
  };

  const selectMarker = (marker, cafe) => {
    if (selectedMarkerRef.current === marker) {
      if (infowindowRef.current) {
        infowindowRef.current.close();
      }
      marker.setImage(originalImageRef.current);
      selectedMarkerRef.current = null;
      infowindowRef.current = null;
      setSelectedCafe(null);
      return;
    }

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setImage(originalImageRef.current);
    }

    if (infowindowRef.current) {
      infowindowRef.current.close();
    }

    setSelectedCafe(cafe);

    var markerImageSrc =
      "https://cdn-icons-png.flaticon.com/512/5497/5497772.png";
    var imageSize = new window.kakao.maps.Size(44, 49);
    var imageOption = { offset: new window.kakao.maps.Point(22, 49) };

    var markerImage = new window.kakao.maps.MarkerImage(
      markerImageSrc,
      imageSize,
      imageOption
    );

    originalImageRef.current = marker.getImage();
    marker.setImage(markerImage);

    selectedMarkerRef.current = marker;

    var infowindow = new window.kakao.maps.InfoWindow({
      content: `
        <div class="${home.infowindow}">
          <h3>${cafe.place_name}</h3>
          <p>${cafe.address_name}</p>
          <a href="http://map.kakao.com/link/to/${cafe.place_name},${cafe.y},${cafe.x}" target="_blank" class="${home.findRouteLink}">길찾기</a>
        </div>
      `,
    });
    infowindow.open(map, marker);
    infowindowRef.current = infowindow;
  };

  const selectCafe = (cafe) => {
    const marker = markerRefs.current[cafe.id];
    selectMarker(marker, cafe);

    if (map) {
      const moveLatLng = new window.kakao.maps.LatLng(cafe.y, cafe.x);
      map.setCenter(moveLatLng);
    }
  };

  return (
    <div className={home.container}>
      <div>
        <h1>카페로 가야하오?</h1>
      </div>
      <input
        type="text"
        placeholder="검색해보세요"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={searchCafes}>찾기</button>
      <button onClick={moveToCurrentLocation}>현재 위치로 이동</button>
      <div id="map" className={home.map}></div>
      <button onClick={() => setShowFavoriteCafes(!showFavoriteCafes)}>
        {showFavoriteCafes ? "카페 리스트 보기" : "찜한 카페 보기"}
      </button>
      {!showFavoriteCafes && (
        <CafeList
          cafes={cafes}
          selectCafe={selectCafe}
          favoriteCafes={favoriteCafes}
          addFavoriteCafe={addFavoriteCafe}
          removeFavoriteCafe={removeFavoriteCafe}
        />
      )}
      {showFavoriteCafes && (
        <FavoriteCafes
          favoriteCafes={favoriteCafes}
          cafeReviews={cafeReviews}
          handleReviewChange={handleReviewChange}
          removeFavoriteCafe={removeFavoriteCafe}
        />
      )}
    </div>
  );
}

export default Home;
