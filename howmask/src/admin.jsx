import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Container } from "react-bootstrap";

axios.defaults.withCredentials = true;
const url = "localhost";
const headers = { withCredentials: true };

const Admin = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    viewList();
  }, []);

  const viewList = () => {
    if (!sessionStorage.getItem("login")) {
      window.location.href = "/";
      return;
    }

    axios
      .get(`http://${url}:8080/user/adminViewList`, { headers })
      .then((returnData) => {
        // alert(returnData.data.message);
        // console.log(returnData.data.result);
        if (returnData.data.result) {
          setList(returnData.data.result);
        } else {
          window.location.href = "/login";
        }
      });
  };

  const deleteList = (email) => {
    const sendParam = { email, headers };

    axios
      .post(`http://${url}:8080/user/admindelete`, sendParam)
      .then((returnData) => {
        if (returnData.data.resultCode === "1") {
          alert("삭제 되었습니다.");
          viewList();
        } else if (returnData.data.resultCode === "0") {
          alert("다시 로그인 해주세요");
          sessionStorage.clear();
          window.location.href = "/login";
        } else {
          alert("삭제 실패");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let listForm = list.map((lists) => {
    const listsEmail = lists.email;
    return (
      <tr key={listsEmail}>
        <td>{lists.user_type === "0" ? "개인" : "판매처"}</td>
        <td>{lists.email}</td>
        <td>{lists.nickname}</td>
        <td>{lists.lockYn === false ? "No" : "Yes"}</td>
        <td>
          <Button>승인</Button>
        </td>
        <td>
          <Button>승인취소</Button>
        </td>
        <td>
          <Button
            onClick={() => {
              deleteList(listsEmail);
            }}
          >
            회원삭제
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <Container>
      <Button onClick={viewList}>새로고침</Button>
      <Table>
        <thead>
          <tr>
            <th>구분</th>
            <th>이메일</th>
            <th>닉네임</th>
            <th>잠금여부</th>
            <th>승인</th>
            <th>승인취소</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{listForm}</tbody>
      </Table>
    </Container>
  );
};

export default Admin;
