const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const connect = require("./schemas");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

connect();

const corsOptions = {
  origin: true,
  credentials: true,
};

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 100, // IP 당 허용하는 요청 횟수
});

fs.readdir("public/upload", (error) => {
  // upl5oads 폴더 없으면 생성
  if (error) {
    fs.mkdirSync("public/upload");
    console.log("upload 폴더 생성됨");
  }
});

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "hamletshu",
    rolling: true, // 로그인 상태에서 페이지 이동시마다 세션 값 변경 여부
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable("x-powered-by"); // 공격자에게 Express 사용된 것을 숨김

app.use(helmet.xssFilter()); // XSS 보안 헤더 적용

// next가 아닌 다른 값 할당시 오류 처리 코드를 실행
app.use(function (req, res, next) {
  next("err");
});

app.use("/user", require("./routes/userRouter"));
app.use("/comment", require("./routes/commentRouter"));
app.use("/store", require("./routes/storeRouter"));
app.use("/mask", require("./routes/maskRouter"), apiLimiter);

// 500 Error 처리
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 404 Error 처리
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(404).send("404 ERROR : No such page.");
});

app.listen(8080, () => {
  console.log("listen umm..umm..um...");
});
