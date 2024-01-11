import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import CafeContext from "./CafeContext";
import home from "./Home.module.css";

function Home() {
  const { selectedCafe, setSelectedCafe } = useContext(CafeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [cafes, setCafes] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 36.5811, lng: 127.9783 });
  const selectedMarkerRef = useRef(null);
  const originalImageRef = useRef(null);
  const infowindowRef = useRef(null);
  const markerRefs = useRef({});
  let map; // map 변수를 상위 범위에서 정의합니다.

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
      map = new window.kakao.maps.Map(mapContainer, options); // map 변수를 초기화합니다.

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
      <div id="map" className={home.map}></div>
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
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
