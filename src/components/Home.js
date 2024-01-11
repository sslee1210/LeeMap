import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import CafeContext from "./CafeContext";
import home from "./Home.module.css";

function Home() {
  const { selectedCafe, setSelectedCafe } = useContext(CafeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 36.5811, lng: 127.9783 });
  const selectedMarkerRef = useRef(null);
  const originalImageRef = useRef(null);
  const infowindowRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("Error: The Geolocation service failed.");
        }
      );
    } else {
      console.error("Error: Your browser doesn't support geolocation.");
    }
  }, []);

  const searchCafes = () => {
    if (window.kakao && window.kakao.maps) {
      var mapContainer = document.getElementById("map");
      var options = {
        center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
        level: 5,
      };
      var map = new window.kakao.maps.Map(mapContainer, options);

      const API_KEY = "34c1bf4fb787d8d21997bed10d5f165e";

      axios
        .get(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${searchTerm}&y=${mapCenter.lat}&x=${mapCenter.lng}`,
          {
            headers: { Authorization: `KakaoAK ${API_KEY}` },
          }
        )
        .then((response) => {
          if (response.data.documents) {
            const cafes = response.data.documents;
            cafes.forEach((cafe) => {
              var markerPosition = new window.kakao.maps.LatLng(cafe.y, cafe.x);
              var marker = new window.kakao.maps.Marker({
                position: markerPosition,
              });
              marker.setMap(map);

              window.kakao.maps.event.addListener(marker, "click", function () {
                if (selectedMarkerRef.current) {
                  selectedMarkerRef.current.setImage(originalImageRef.current);
                }
                if (infowindowRef.current) {
                  infowindowRef.current.close();
                }
                setSelectedCafe(cafe);

                var markerImageSrc =
                  "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png";
                var imageSize = new window.kakao.maps.Size(64, 69);
                var imageOption = {
                  offset: new window.kakao.maps.Point(27, 69),
                };
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
                    <div>
                      <h3>${cafe.place_name}</h3>
                      <p>${cafe.address_name}</p>
                      <a href="http://map.kakao.com/link/to/${cafe.place_name},${cafe.y},${cafe.x}" target="_blank" class="${home.findRouteLink}">길찾기</a>
                    </div>
                  `,
                });
                infowindow.open(map, marker);
                infowindowRef.current = infowindow;
              });
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

  return (
    <div>
      <div>
        <h1>어디로 가야하오?</h1>
      </div>
      <input
        type="text"
        placeholder="검색해보세요"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={searchCafes}>찾기</button>
      <div id="map" style={{ width: "100%", height: "800px" }}></div>
    </div>
  );
}

export default Home;
