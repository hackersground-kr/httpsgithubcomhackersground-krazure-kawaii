const express = require('express');
const db = require('../database');
const multer = require('multer');
const uuid = require('uuid');
const { resolve, extname } = require('path'); // Add this line to import the resolve and extname functions
require("dotenv").config();
const { validEmailCheck, validBirthCheck, validType } = require('../utils/vaildCheck')
const hash = require('../utils/hash')
const getRandom = require('../utils/getRandom');
const { rmSync } = require('fs');
const jsonwebtoken = require('../utils/jsonwebtoken')

const authRouter = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(process.cwd(), 'public/profile/'));
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
});


authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const [user] = await db.select('*').from('authentity').where({ email }).catch((err) => {})

  try {
    if (!email) throw ({ status: 400, message: '이메일을 입력해주세요.' })
    if (!password) throw ({ status: 400, message: '비밀번호를 입력해주세요.' })
    if (!user) throw ({ status: 400, message: '이메일 또는 비밀번호를 확인해주세요.' })
  } catch (err) {
    return res.status(err.status).json({ success: false, message: err.message });
  }

  try {
    if (user.password === hash(password + user.salt)) {
      const token = jsonwebtoken.sign({ uuid: user.uuid, nickname: user.nickname }, process.env.JWT_SECRET)

      return res.status(201).json({
        success: true,
        token
      })
    } else {
      return res.status(400).json({
        success: false,
        message: '이메일 혹은 비밀번호를 확인해주세요.'
      })
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server Errors' });
  }
})

authRouter.post('/signUp', upload.single('file'), async (req, res) => {
  const { email, password, nickname, gender, birth, role } = req.body;
  const file = req.file;

  try {
    if (!file) throw ({ status: 400, message: '프로필 이미지를 등록해주세요.' })
    if (!email) throw ({ status: 400, message: '이메일을 입력해주세요.' })
    else {
      if (validEmailCheck(email)) throw ({ status: 400, message: '이메일을 확인해주세요.' })
      const [user] = await db.select('*').from('authentity').where({ email }).catch((err) => {})
      
      if (user) throw ({ status: 400, message: '이미 존재하는 이메일입니다.' })
    }
    if (!password) throw ({ status: 400, message: '비밀번호를 입력해주세요.' })
    if (!nickname) throw ({ status: 400, message: '닉네임을 입력해주세요.' })
    else {
      const [user] = await db.select('*').from('authEntity').where({ nickname }).catch((err) => {})

      if (user) throw ({ status: 400, message: '이미 존재하는 닉네임입니다.' })
    }
    if (!gender) throw ({ status: 400, message: '성별을 입력해주세요.' })
    else {
      if (!validType(gender, ["M", "F"])) throw ({ status: 400, message: '성별을 확인해주세요.' })
    }
    if (!birth) throw ({ status: 400, message: '생년월일을 입력해주세요.' })
    else {
      if (validBirthCheck(birth)) throw ({ status: 400, message: '생년월일을 확인해주세요.' })
    }
    if (!role) throw ({ status: 400, message: 'role에 student 혹은 teacher을 입력해주세요.' })
    else {
      if (!validType(role, ["student", "teacher"])) throw ({ status: 400, message: 'role을 확인해주세요.' })
    }
  } catch (err) {
    if (file) rmSync(resolve(process.cwd(), 'public/profile', file.filename))
    return res.status(err.status).json({ success: false, message: err.message });
  }

  try {
    const salt = getRandom('all', 64)
    
    await db.insert({
      uuid: uuid.v4(),
      email,
      password: hash(password + salt),
      salt,
      nickname,
      gender,
      birth,
      profileImage: file.filename,
      role
    }).into('authEntity')

    return res.status(201).json({
      success: true
    })
  } catch (err) {
    if (file) rmSync(resolve(process.cwd(), 'public/profile', file.filename))
    return res.status(500).json({ success: false, message: 'Server Errors' });
  }
})

authRouter.get('/user/info', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const verify = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const user = await db('authentity')
    .select('authentity.*', 'majorentity.*')
    .where('authentity.uuid', verify.uuid)
    .leftJoin('majorentity', 'authentity.uuid', 'majorentity.author')
    .catch((err) => {})


  try {
    if (!token || !verify.success || !user) throw ({ status: 400, message: '비 정상적인 토큰 입니다.' })
  } catch (err) {
    return res.status(err.status).json({ success: false, message: err.message });
  }

  return res.status(200).json({
    success: true,
    user: {
      uuid: verify.uuid,
      email: user[0].email,
      nickname: user[0].nickname,
      gender: user[0].gender,
      birth: user[0].birth,
      profileImage: user[0].profileImage,
      role: user[0].role,
      major_childrens: user[0].major ? user.map((user) => ({
        status: user.status,
        major: user.major,
        filePath: user.filePath
      })) : undefined
    }
  })
})

module.exports = authRouter;