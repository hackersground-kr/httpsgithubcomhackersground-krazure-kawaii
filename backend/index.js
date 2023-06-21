const express = require('express');

class ExpressApp {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // 미들웨어 설정
    this.app.use(express.json()); // JSON 파싱을 위한 미들웨어
    // 다른 미들웨어 설정 가능
  }

  setupRoutes() {
    // 라우트 설정
    this.app.get('/', (req, res) => {
      res.send('Hello, World!');
    });
    // 다른 라우트 설정 가능
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}

// 애플리케이션 인스턴스 생성 및 서버 시작
const app = new ExpressApp();
app.start(3000); // 포트 번호는 필요에 따라 변경 가능
