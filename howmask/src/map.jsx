import React, { useState, useEffect } from "react";
import { usePosition } from "use-position";
import { Button } from "react-bootstrap";
import axios from "axios";
import StoreModal from "./store_info";
import Search from "./search";
import Notice from "./notice";

const { kakao } = window;
const { daum } = window;
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const Map = () => {
  let { latitude, longitude } = usePosition();
  const [positions, setPositions] = useState();
  const [coords, setCoords] = useState({
    lat: null,
    lng: null,
  });
  const [level, setLevel] = useState(3);
  const [modalShow, setModalShow] = useState(false);
  const [noticeShow, setNoticeShow] = useState(true);
  const [storeInfo, setStoreInfo] = useState();
  const [word, setWord] = useState(null);

  async function getInfoByGeo(lat, lng) {
    const info = [];
    const send_param = {
      headers,
      lat,
      lng,
      m: 5000,
    };
    const result = await axios.post(
      process.env.REACT_APP_URL+"mask/storesByGeo",
      send_param
    );
    if (result.data.storeList) {
      result.data.storeList.forEach((item) => {
        info.push({
          title: item.name,
          latlng: new kakao.maps.LatLng(item.lat, item.lng),
          //약국 정보
          storeInfo: {
            addr: item.addr,
            name: item.name,
            stock: item.remain_stat,
            code: item.code,
            type: item.type,
            createdAt: item.created_at,
            stockAt: item.stock_at,
          },
        });
      });
    }
    setPositions(info);
  }
  async function getInfoByAddr(keyWord) {
    const info = [];
    const send_param = {
      headers,
      address: keyWord,
    };
    const result = await axios.post(
      process.env.REACT_APP_URL+"mask/storesByAddr",
      send_param
    );
    if (result.data.storeList) {
      result.data.storeList.forEach((item) => {
        info.push({
          title: item.name,
          latlng: new kakao.maps.LatLng(item.lat, item.lng),
          storeInfo: {
            addr: item.addr,
            name: item.name,
            stock: item.remain_stat,
            code: item.code,
            type: item.type,
            createdAt: item.created_at,
            stockAt: item.stock_at,
          },
        });
      });
    }
    setPositions(info);
  }

  function clickSearch(word) {
    setWord(word);
  }

  function current() {
    setWord(null);
    setCoords({ lat: coords.lat, lng: coords.lng });
  }

  useEffect(() => {
    if (word) {
      getInfoByAddr(word);
    }
  }, [word]);
  useEffect(() => {
    if (!word) {
      if (latitude && longitude && !(coords.lat && coords.lng)) {
        getInfoByGeo(latitude, longitude);
      }
    }
  }, [latitude, longitude, word, coords.lat, coords.lng]);
  useEffect(() => {
    if (!word) {
      if (coords.lat && coords.lng) {
        getInfoByGeo(coords.lat, coords.lng);
      }
    }
  }, [coords, word, coords.lat, coords.lng]);

  useEffect(() => {
    // latitude=36.7850103;
    // longitude=127.2346184;
    if (latitude && longitude) {
      // 지도의 중심 위치 지정
      
      let lat, lng;
      if (coords.lat === null) {
        lat = latitude;
        lng = longitude;
      } else {
        lat = coords.lat;
        lng = coords.lng;
      }
      let el = document.getElementById("map");
      let map = new daum.maps.Map(el, {
        center: new daum.maps.LatLng(lat, lng),
        level,
      });
      // 현재 위치에 표시될 마커의 위치입니다
      var markerPosition = new kakao.maps.LatLng(latitude, longitude);
      let imageSrc;

      if (positions) {
        for (var i = 0; i < positions.length; i++) {
          if (positions[i].storeInfo.stock === "plenty") {
            imageSrc = "/green_mask.png";
          } else if (positions[i].storeInfo.stock === "some") {
            imageSrc = "/yellow_mask.png";
          } else if (positions[i].storeInfo.stock === "few") {
            imageSrc = "/red_mask.png";
          } else {
            //1개 이하 empty, 판매중지 break
            imageSrc = "/gray_mask.png";
          }

          // 마커 이미지의 이미지 크기 입니다
          var imageSize = new kakao.maps.Size(35, 35);

          // 마커 이미지를 생성합니다
          var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
          // 마커를 생성합니다
          var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage, // 마커 이미지
          });

          // 마커에 클릭이벤트를 등록합니다
          //kakao.maps.event.addListener(marker, 'click', makeClickListener(map, marker, infowindow));

          (function (marker, info) {
            // 마커에 mouseover 이벤트를 등록하고 마우스 오버 시 인포윈도우를 표시합니다
            kakao.maps.event.addListener(marker, "click", function () {
              setStoreInfo(info);
              setModalShow(true);
            });
          })(marker, positions[i].storeInfo);
        }
      }
      //현재 위치 마커를 생성합니다
      marker = new kakao.maps.Marker({
        map: map,
        position: markerPosition,
      });
      // 마우스 드래그로 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(map, "dragend", function () {
        // 지도 중심좌표를 얻어옵니다
        let latlng = map.getCenter();
        setCoords({ lat: latlng.getLat(), lng: latlng.getLng() });
      });
      // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(map, "zoom_changed", function () {
        // 지도의 현재 레벨을 얻어옵니다
        let level = map.getLevel();

        setLevel(level);
      });

      // 주소-좌표 변환 객체를 생성합니다
      var geocoder = new kakao.maps.services.Geocoder();
      // 주소로 좌표를 검색합니다
      if (word) {
        geocoder.addressSearch(word, function (result, status) {
          // 정상적으로 검색이 완료됐으면
          if (status === kakao.maps.services.Status.OK) {
            let latlng = new kakao.maps.LatLng(result[0].y, result[0].x);

            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
              map: map,
              position: latlng,
            });

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            var infowindow = new kakao.maps.InfoWindow({
              content: `<div style="width:150px;text-align:center;padding:6px 0;">${word}</div>`,
            });
            infowindow.open(map, marker);

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다

            setCoords({ lat: latlng.getLat(), lng: latlng.getLng() });

            map.setCenter(latlng);
          }
        });
      }
    }
  }, [positions, latitude, longitude, word]);

  let modal;
  if (modalShow) {
    modal = (
      <StoreModal
        show={modalShow}
        storeInfo={storeInfo}
        onHide={() => setModalShow(false)}
      />
    );
  }

  let noticeModal;
  if (noticeShow) {
    noticeModal = (
      <Notice show={noticeShow} onHide={() => setNoticeShow(false)}></Notice>
    );
  }

  return (
    <div id="mapPage">
      <div id="searchDiv">
        <Search page={"map"} clickSearch={clickSearch} />
        <Button id="current" onClick={current}>
          현재위치로 다시 검색
        </Button>
      </div>

      <div className="App" id="map"></div>
      {modal}
      {noticeModal}
    </div>
  );
};
export default Map;
