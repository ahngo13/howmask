import React, { useState, useEffect, useRef } from "react";
import { Form, Col, Button } from "react-bootstrap";
import axios from "axios";

const url = "localhost";

// 판매처 정보 관리 Form
const Store = () => {
  const [btnDefaultFlag, setBtnDefaultFlag] = useState("inline-block"); //수정하기 버튼
  const [btnSuccessFlag, setBtnSuccessFlag] = useState("none"); //수정완료 버튼
  const [title, setTitle] = useState(" 판매처 정보 조회");
  const [textFlag, setTextFlag] = useState(true);

  const [code, setCode] = useState();
  const [storeNameState, setStoreNameState] = useState();
  const [addrState, setAddrState] = useState();
  const [bizCodeState, setBizCodeState] = useState();
  const [sellerNameState, setSellerNameState] = useState();
  const [phoneState, setPhoneState] = useState();
  const [emailState, setEmailState] = useState();
  const [soldTimeState, setSoldTimeState] = useState();
  const [stockAverageState, setStockAverageState] = useState();
  const [kidMaskState, setKidMaskState] = useState();
  const [noticeState, setNoticeState] = useState();

  const storeName = useRef(); //판매처명 (store)
  const addr = useRef(); //주소 (store)
  const bizCode = useRef(); //사업자등록번호 (store)
  const sellerName = useRef(); //관리자 이름 (store)
  const phone = useRef(); // 관리자 휴대전화번호 (store)
  const email = useRef(); // 관리자 이메일 (user)
  const soldTime = useRef(); //판매 예정시간
  const stockAverage = useRef();  //재고 수량
  const kidMask =useRef(); // 유야용 마스크
  const notice = useRef(); // 공지사항

  const registerTitle = {
    display: "inline-block",
    width: "50%",
    position: "fixed",
    top: 60,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
    textAlign: "center"
  };
  const registerForm = {
    display: "inline-block",
    width: "50%",
    position: "fixed",
    top: 100,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto"
  };
  const btnDefaultStyle = {
    display: btnDefaultFlag
  };
  const btnSuccessStyle = {
    display: btnSuccessFlag
  };
  function goToUpdateForm() {
    console.log("수정하기");
    setBtnSuccessFlag("inline-block");
    setBtnDefaultFlag("none");
    setTitle("판매처 정보 수정");
    setTextFlag(false);
  }
  async function updateInfo() {
    const sendParam = {
      code,
      name: storeName.current.value,
      address: addr.current.value,
      bizCode: bizCode.current.value,
      sellerName: sellerName.current.value,
      phone: phone.current.value,
      email: email.current.value,
      soldTime: soldTime.current.value,
      stockAverage: stockAverage.current.value,
      kidMask: kidMask.current.value,
      notice: notice.current.value,
    };
    const result = await axios.post(`http://${url}:8080/store/update`, sendParam);
    if(result.data.message){
      alert(result.data.message);
      setBtnSuccessFlag("none");
      setBtnDefaultFlag("inline-block");
      setTitle("판매처 정보 조회");
      setTextFlag(true);
    }else{
      alert("수정실패");
    }
  }

  async function getInfo(){
    console.log("getInfo");
    const result = await axios.post(`http://${url}:8080/store/getInfo`);
    if(result.data.info){
      const info = result.data.info;
      setCode(info.code);
      setStoreNameState(info.storeName);
      setBizCodeState(info.bizCode);
      setAddrState(info.address);
      setSellerNameState(info.sellerName);
      setPhoneState(info.phone);
      setEmailState(result.data.email);
      setSoldTimeState(info.soldTime);
      setStockAverageState(info.stockAverage);
      setKidMaskState(info.kidsMask);
      setNoticeState(info.notice);
    }else{
      console.log("setting fail");
    }
  }
  


  useEffect(()=>{
    console.log("useEffect");
    getInfo()
  },[])

  return (
    <>
      <h2 style={registerTitle}>{title}</h2>
      <div
        style={{
          position: "absolute",
          left: "60%",
          top: "8%"
        }}
      >
        <Button variant="warning" style={btnDefaultStyle} onClick={() => goToUpdateForm(true)}>
          수정하기
        </Button>
        <Button variant="success" style={btnSuccessStyle} onClick={() => updateInfo(true)}>
          수정완료
        </Button>
      </div>
      <Form style={registerForm}>
        <Form.Text className="text-muted"></Form.Text>
        <Form.Label>판매처 정보</Form.Label>
        <Form.Text className="text-muted"></Form.Text>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>
              <font color="#246dbf">판매처명</font>
            </Form.Label>
            <Form.Control ref={storeName} readOnly={textFlag} defaultValue={storeNameState} />
          </Form.Group>
          <Form.Group as={Col} controlId="storeLocation">
            <Form.Label>
              <font color="#246dbf">사업자등록번호</font>
            </Form.Label>
            <Form.Control ref={bizCode} readOnly={textFlag} defaultValue={bizCodeState} />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>
              <font color="#246dbf">주소</font>
            </Form.Label>
            <Form.Control ref={addr} readOnly={textFlag} defaultValue={addrState} />
          </Form.Group>
        </Form.Row>
        <br />
        <Form.Label>관리자 정보</Form.Label>
        <Form.Row>
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>
              <font color="#246dbf">이름</font>
            </Form.Label>
            <Form.Control ref={sellerName} readOnly={textFlag} defaultValue={sellerNameState} />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>
              <font color="#246dbf">휴대전화번호</font>
            </Form.Label>
            <Form.Control ref={phone} readOnly={textFlag} defaultValue={phoneState} />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridZip">
            <Form.Label>
              <font color="#246dbf">이메일</font>
            </Form.Label>
            <Form.Control ref={email} readOnly={textFlag} defaultValue={emailState} />
          </Form.Group>
        </Form.Row>
        <br />
        <Form.Label>마스크 정보</Form.Label>
        <Form.Row>
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>
              <font color="#246dbf">판매 예정시간</font>
            </Form.Label>
            <Form.Control ref={soldTime} readOnly={textFlag} defaultValue={soldTimeState} />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>
              <font color="#246dbf">평균 재고수량</font>
            </Form.Label>
            <Form.Control ref={stockAverage} readOnly={textFlag} defaultValue={stockAverageState} />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridZip">
            <Form.Label>
              <font color="#246dbf">유아용마스크 판매여부</font>
            </Form.Label>
            <Form.Control ref={kidMask} readOnly={textFlag} defaultValue={kidMaskState} />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>
              <font color="#246dbf">공지사항</font>
            </Form.Label>
            <Form.Control ref={notice} as="textarea" readOnly={textFlag} defaultValue={noticeState} />
          </Form.Group>
        </Form.Row>
      </Form>
    </>
  );
};

export default Store;
