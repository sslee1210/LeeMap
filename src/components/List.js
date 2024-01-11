import React, { useContext } from "react";
import CafeContext from "./CafeContext";
import list from "./List.module.css";

const List = () => {
  const { selectedCafe } = useContext(CafeContext);

  return (
    <div>
      <div>
        <h1>장소 정보 :</h1>
      </div>
      <div>
        {selectedCafe ? (
          <div>
            <h2>{selectedCafe.place_name}</h2>
            <p>{selectedCafe.address_name}</p>
            {selectedCafe.phone && <p>{selectedCafe.phone}</p>}
          </div>
        ) : (
          <p>장소를 클릭해보세요.</p>
        )}
      </div>
    </div>
  );
};

export default List;
