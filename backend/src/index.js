const express = require('express');
const cors = require('cors');
const fs = require('fs');


const db = require('./database');
const authRouter = require('./routes/auth');
const lectureRouter = require('./routes/lecture');
const reviewRouter = require('./routes/review');
const fileRouter = require('./routes/file');
const categoryRouter = require('./routes/category');
require("dotenv").config();

class ExpressApp {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    check();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(cors());
  }

  setupRoutes() {
    this.app.get('/api', (req, res) => { 
      return res.status(200).json({
        status: true
      }) 
    });

    this.app.use('/api/auth', authRouter)
    this.app.use('/api/lecture', lectureRouter)
    this.app.use('/api/file', fileRouter)
    this.app.use('/api/review', reviewRouter)
    this.app.use('/api/category', categoryRouter)
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
