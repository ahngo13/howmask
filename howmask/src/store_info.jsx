import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Badge, Table, Card, Container, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Comment from "./comment";
import axios from "axios";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

let kidsMaskColor = "";

//판매처 상세정보 Modal
function StoreInfoModal(props) {
  const [stockColor, setStockColor] = useState();
  const [stockText, setStockText] = useState();
  const [stockType, setStockType] = useState();
  const [sellerstate, setSellerstate] = useState({
    soldTime: "",
    stockAverage: "",
    kidsMask: "",
    notice: "",
    startTime: "",
    endTime: "",
  });

  const [formstate, setFormstate] = useState(false);

  const registerSeller = useRef();

  function howMany() {
    const stock = props.info.stock;
    return (
      <div>
        {(() => {
          if (stock === "plenty") {
            setStockColor("success");
            setStockText("100개 이상");
            return;
          } else if (stock === "some") {
            setStockColor("warning");
            setStockText("30개 이상~100개 미만");
            return;
          } else if (stock === "few") {
            setStockColor("danger");
            setStockText("2개 이상~30개 미만");
            return;
          } else if (stock === "empty") {
            setStockColor("secondary");
            setStockText("1개 이하");
            return;
          } else {
            setStockColor("secondary");
            setStockText("재고 없음");
            return;
          }
        })()}
      </div>
    );
  }
  function storeType() {
    const type = props.info.type;
    return (
      <div>
        {(() => {
          if (type === "01") {
            setStockType("약국");
            return;
          } else if (type === "02") {
            setStockType("우체국");
            return;
          } else if (type === "03") {
            setStockType("농협");
            return;
          }
        })()}
      </div>
    );
  }

  const loadSellerdata = async (code) => {
    const sendParam = { headers, code };
    axios
      .post(process.env.REACT_APP_URL+`store/loadsellerdata`, sendParam)
      .then((returnData) => {
        switch (returnData.data.kidsMask) {
          case "무":
            kidsMaskColor = "danger";
            break;
          case "유":
            kidsMaskColor = "primary";
            break;
          default:
            break;
        }
        if (returnData.data.startTime) {
          setSellerstate({
            soldTime: returnData.data.soldTime,
            stockAverage: returnData.data.stockAverage,
            kidsMask: returnData.data.kidsMask,
            notice: returnData.data.notice,
            startTime: returnData.data.startTime + "~",
            endTime: returnData.data.endTime,
          });
          setFormstate(true);
        }
      })
      .catch((err) => {
        window.location.href = "/error";
      });
    return;
  };

  useEffect(() => {
    howMany();
    storeType();
  });

  useEffect(() => {
    loadSellerdata(props.info.code);
  }, [props.info.code]);

  let sellerform;
  if (formstate) {
    sellerform = (
      <>
        <Table responsive borderless>
          <tbody>
            <tr>
              <td>
                <strong>
                  <font color="#1a0066">판매처 종류</font>
                </strong>
                &nbsp;&nbsp;&nbsp; {stockType}
              </td>
              <td>
                <strong>
                  <font color="#1a0066">주소</font>
                </strong>
                &nbsp;&nbsp;&nbsp; {props.info.addr}
              </td>
            </tr>
            <tr>
              <td>
                <strong>
                  <font color="#1a0066">영업시간</font>
                </strong>
                &nbsp;&nbsp;&nbsp; {sellerstate.startTime}
                {sellerstate.endTime}
              </td>
              <td>
                <strong>
                  <font color="#1a0066">입고시간</font>
                </strong>
                &nbsp;&nbsp;&nbsp; {props.info.stockAt}
              </td>
            </tr>
            <tr>
              <td>
                <strong>
                  <font color="#1a0066">판매예정시간</font>
                </strong>
                &nbsp;&nbsp;&nbsp; {sellerstate.soldTime}
              </td>
              <td>
                <strong>
                  <font color="#1a0066">평균 재고수량</font>
                </strong>
                &nbsp;&nbsp;&nbsp; {sellerstate.stockAverage}
              </td>
            </tr>
          </tbody>
        </Table>
        <Table responsive borderless>
          <tbody>
            <tr>
              <td>
                <font color="#1a0066">
                  <strong>유아용 마스크 판매여부</strong>
                </font>
                &nbsp;&nbsp;&nbsp; <Badge variant={kidsMaskColor}>{sellerstate.kidsMask}</Badge>
              </td>
            </tr>
          </tbody>
        </Table>
        <Table responsive borderless>
          <tbody>
            <tr>
              <td>
                <font color="#1a0066">
                  <strong>공지사항</strong>
                </font>
                <Card>
                  <Card.Body>
                    <p>{sellerstate.notice}</p>
                  </Card.Body>
                </Card>
              </td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  } else {
    sellerform = (
      <>
        <Table responsive borderless>
          <tbody>
            <tr>
              <td>
                <strong>
                  <font color="#1a0066">판매처 종류</font>
                </strong>
                &nbsp;&nbsp;&nbsp; {stockType}
              </td>
              <td>
                <strong>
                  <font color="#1a0066">주소</font>
                </strong>
                &nbsp;&nbsp;&nbsp; {props.info.addr}
              </td>
            </tr>
            <tr>
              <td>
                <strong>
                  <font color="#1a0066">입고시간</font>
                </strong>
                &nbsp;&nbsp;&nbsp; {props.info.stockAt}
              </td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </>
    );
  }

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.info.name}
          &nbsp;&nbsp;&nbsp;<Badge variant={stockColor}>{stockText}</Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {sellerform}

        <Container>
          <Row>
            <Col>
              <NavLink
                to={{
                  pathname: `/suggest`,
                  state: {
                    code: props.info.code,
                    name: props.info.name,
                    addr: props.info.addr,
                    type: props.info.type,
                  },
                }}
              >
                <Button variant="warning" size="lg" block>
                  판매처정보가 잘못되었어요!
                </Button>
              </NavLink>
            </Col>
            <Col>
              <NavLink
                to={{
                  pathname: `/registerSeller`,
                  state: {
                    code: props.info.code,
                    name: props.info.name,
                    addr: props.info.addr,
                    type: props.info.type,
                  },
                }}
              >
                <Button className="register" ref={registerSeller} variant="info" size="lg" block>
                  무료 판매처계정 생성하기
                </Button>
              </NavLink>
            </Col>
          </Row>
          <br />
        </Container>
        <Comment code={props.info.code} />
      </Modal.Body>
    </Modal>
  );
}

function StoreInfo(props) {
  let modal;
  if (props.storeInfo) {
    modal = <StoreInfoModal show={props.show} info={props.storeInfo} onHide={props.onHide} />;
  }

  return <>{modal}</>;
}

export default StoreInfo;
