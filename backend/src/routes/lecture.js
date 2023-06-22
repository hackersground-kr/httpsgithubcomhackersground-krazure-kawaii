const express = require('express');
const uuid = require('uuid');
const jsonwebtoken = require('../utils/jsonwebtoken');
const db = require('../database');
const multer = require('multer');
require("dotenv").config();
const { resolve, extname } = require('path');
const { rmSync, existsSync } = require('fs');
const countArr = require('../utils/countArr');

const lectureRouter = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(process.cwd(), 'public/banner'));
    },
    filename: (req, file, cb) => {
      const fileExtName = extname(file.originalname);
      if (
        !fileExtName.includes('.jpg') &&
        !fileExtName.includes('.jpeg') &&
        !fileExtName.includes('.png') &&
        !fileExtName.includes('.bmp') &&
        !fileExtName.includes('.gif')
      ) {
        return cb(new Error('check your image type'));
      }
      const fileName = file.originalname.replace(fileExtName, '');
      cb(null, `${fileName}_${Date.now()}${fileExtName}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
})

function compareTime(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (start.getTime() === end.getTime()) {
    return 0; // startTime과 endTime이 같을 경우
  } else if (start < end) {
    return -1; // startTime이 endTime보다 이전일 경우
  } else {
    return 1; // startTime이 endTime보다 이후일 경우
  }
}

lectureRouter.post('/insert', upload.single('file'), async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const verify = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const file = req.file;
  
  const {
    category,
    title,
    description,
    location,
    startTime,
    endTime,
    price,
    capacity,
    type
  } = req.body;

  const [user] = await db.select('*').from('authentity').where({ uuid: verify.uuid }).catch((err) => {})
  const [categoryData] = await db.select('*').from('categoryEntity').where({ name: category }).catch((err) => {})
  
  try {
    if (!category) throw ({ status: 400, message: '카테고리를 선택해주세요.' })
    else {
      if (!categoryData) throw ({ status: 400, message: '존재하지 않는 카테고리 입니다.' })
    }
    if (!title) throw ({ status: 400, message: '강의명을 입력해주세요.' })
    if (!description) throw ({ status: 400, message: '강의 설명을 입력해주세요.' })
    if (!location) throw ({ status: 400, message: '온라인 강의라면 화상 서비스(Zoom, Meet) 주소를, 오프라인 강의라면 강의 장소 주소를 입력해주세요.' })
    if (!startTime) throw ({ status: 400, message: '강의를 시작할 시간을 입력해주세요.' })
    if (!endTime) throw ({ status: 400, message: '강의가 끝나는 시간을 입력해주세요.' })
    if (compareTime(startTime, endTime) !== -1) throw ({ status: 400, message: '강의 시작 시간이 종료 시간보다 늦습니다.'})
    if (!price) throw ({ status: 400, message: '강의료를 입력해주세요.' })
    if (!capacity) throw ({ status: 400, message: '수강생 수를 입력해주세요.' })
    if (!type) throw ({ status: 400, message: '온라인 강의, 오프라인 강의 선택해주세요.' })
    if (!token || !verify.success || !user) throw ({ status: 400, message: '비 정상적인 토큰 입니다.' })
    if (!file) throw ({ status: 400, message: '배너 이미지를 첨부해주세요.' })
    else {
      if (user.role !== "teacher") throw ({ status: 401, message: '권한이 없습니다. 강사 권한 신청을 해주세요.' })
    }
  } catch (err) {
    if (file) rmSync(resolve(process.cwd(), 'public/banner', file.filename))
    return res.status(err.status).json({ success: false, message: err.message });
  }

  try {
    await db.insert({
      uuid: uuid.v4(),
      categoryUUID: categoryData.uuid,
      teacherUUID: verify.uuid,
      title,
      description,
      location,
      startTime,
      endTime,
      price,
      capacity,
      type,
      bannerImage: file.filename
    }).into('lectureEntity')
    
    return res.status(200).json({
      success: true
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Server Errors'
    })
  }
})

lectureRouter.post('/update', upload.single('file'), async (req, res) => {
  const { 
    uuid, 
    category, 
    title, 
    description, 
    capacity, 
    location, 
    startTime, 
    endTime, 
    price, 
    type 
  } = req.body;

  const token = req.headers.authorization.split(' ')[1];
  const verify = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const file = req.file;
  const [user] = await db.select('*').from('authentity').where({ uuid: verify.uuid }).catch((err) => {})
  const [categoryData] = await db.select('*').from('categoryEntity').where({ name: category }).catch((err) => {})
  const [lectureData] = await db.select('*').from('lectureEntity').where({ uuid, teacherUUID: user.uuid }).catch((err) => {})

  try {
    if (!uuid) throw ({ status: 400, message: 'uuid를 입력해주세요.' })
    else {
      if (!lectureData) throw ({ status: 400, message: '존재하지 않는 강의이거나 권한이 없습니다.' })
    }
    if (!category) throw ({ status: 400, message: '카테고리를 선택해주세요.' })
    else {
      if (!categoryData) throw ({ status: 400, message: '존재하지 않는 카테고리 입니다.' })
    }
    if (!title) throw ({ status: 400, message: '강의명을 입력해주세요.' })
    if (!description) throw ({ status: 400, message: '강의 설명을 입력해주세요.' })
    if (!location) throw ({ status: 400, message: '온라인 강의라면 화상 서비스 주소를, 오프라인 강의라면 강의 장소 주소를 입력해주세요.' })
    if (!startTime) throw ({ status: 400, message: '강의를 시작할 시간을 입력해주세요.' })
    if (!endTime) throw ({ status: 400, message: '강의가 끝나는 시간을 입력해주세요.' })
    if (compareTime(startTime, endTime) !== -1) throw ({ status: 400, message: '강의 시작 시간이 종료 시간보다 늦습니다.'})
    if (!price) throw ({ status: 400, message: '강의료를 입력해주세요.' })
    if (!capacity) throw ({ status: 400, message: '수강생 수를 입력해주세요.' })
    if (!type) throw ({ status: 400, message: '온라인 강의, 오프라인 강의 선택해주세요.' })
    if (!token || !verify.success || !user) throw ({ status: 400, message: '비 정상적인 토큰 입니다.' })
  } catch(e) {
    return res.status(e.status).json({
      success: false,
      msg: e.message
    })
  }

  if(file) {
    if (lectureData.bannerImage) {
      const exists = existsSync(resolve(process.cwd(), 'public/banner', lectureData.bannerImage))
      if (exists) rmSync(resolve(process.cwd(), 'public/banner', lectureData.bannerImage))
    }
  }

  try {
    await db.update({ 
      title,
      description,
      location,
      startTime,
      endTime,
      price,
      capacity,
      type,
      bannerImage: file ? file.filename : lectureData.bannerImage
    }).from('lectureEntity').where({
      uuid
    })

    return res.status(200).json({
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Errors'
    })
  }
})

lectureRouter.post('/enrolment', async (req, res) => {
  const { lecture } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const verify = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const [user] = await db.select('*').from('authentity').where({ uuid: verify.uuid }).catch((err) => {})
  const [lectureData] = await db.select('*').from('lectureEntity').where({ uuid: lecture }).catch((err) => {});
  const [registData] = await db.select('*').from('registentity').where({ lectureUUID: lecture }).catch((err) => {});

  try {
    if (!lecture) throw ({ status: 400, message: 'lecture을 입력해주세요.' })
    if (!token || !verify.success || !user) throw ({ status: 400, message: '비 정상적인 토큰 입니다.' })
    if (user.role !== 'student') throw ({ status: 400, message: '학생만 접근 가능합니다.' })
    if (!lectureData) throw ({ status: 400, message: '존재하지 않는 강의 입니다.' })
    if (registData) throw ({ status: 401, message: '이미 수강중인 강의 입니다.' })
    if (lectureData.capacity <= countArr(registData)) throw ({ status: 400, message: '수강생이 가득 찼습니다.' })
  } catch (err) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    })
  }

  try {
    await db.insert({
      uuid: uuid.v4(),
      lectureUUID: lecture,
      author: user.uuid
    }).into('registEntity')

    return res.status(201).json({
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Errors'
    })
  }
})

lectureRouter.get('/student/view', async(req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const verify = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const [user] = await db.select('*').from('authentity').where({ uuid: verify.uuid }).catch((err) => {})
  try {
    if (!token || !verify.success || !user) throw ({ status: 400, message: '비 정상적인 토큰 입니다.' })
  } catch (err) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    })
  }

  try {
    const lectrueData = await db.select('*')
      .from('registEntity')
      .leftJoin('lectureEntity', 'registEntity.lectureUUID', 'lectureEntity.uuid')
      .where({ author: user.uuid })
      .catch((err) => {})

    return res.status(200).json({
      success: true,
      lectrue: lectrueData[0] ? lectrueData.map((data) => ({
        title: data.title,
        description: data.description,
        location: data.location,
        startTime: data.startTime,
        endTime: data.endTime,
        price: data.price,
        capacity: data.capacity,
        bannerImage: data.bannerImage,
        type: data.type,
        categoryUUID: data.categoryUUID,
        teacherUUID: data.teacherUUID
      })) : undefined
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Errors'
    })
  }
})

lectureRouter.get('/teacher/view', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const verify = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const [user] = await db.select('*').from('authentity').where({ uuid: verify.uuid }).catch((err) => {})
  
  try {
    if (!token || !verify.success || !user) throw ({ status: 400, message: '비 정상적인 토큰 입니다.' })
    if (user.role !== 'teacher') throw ({ status: 400, message: '강의자만 접근 가능합니다.' })
  } catch (err) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    })
  }

  try {
    const [lectureData] = await db.select('*').from('lectureEntity').where({ teacherUUID: verify.uuid }).catch((err) => {})

    return res.status(200).json({
      success: true,
      lecture: lectureData
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Errors'
    })
  }
})

lectureRouter.get('/info/:id', async (req, res) => {
  const { id } = req.params;

  const [lecture] = await db.select('*')
    .from('lectureEntity')
    .where({ uuid: id })
    .catch((err) => {})
  try {
    if (!id) throw ({ status: 400, message: 'uuid를 입력해주세요.' })
    if (!lecture) throw ({ status: 400, message: '존재하는 lecture 데이터가 없습니다.' })
  } catch (err) {
    return res.status(err).json({
      success: false,
      message: err.message
    })
  }

  return res.status(200).json({
    success: true,
    lecture
  })
})

module.exports = lectureRouter;