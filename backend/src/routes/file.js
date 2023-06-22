const express = require('express');
const db = require('../database');
require("dotenv").config();

const fileRouter = express.Router();

fileRouter.get('/profile/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  const [user] = await db.select('*').from('authentity').where({ uuid }).catch((err) => {})

  try {
    if (!uuid) throw ({ status: 400, message: 'uuid를 입력해주세요.' })
    else {
      if (!user) throw ({ status: 400, message: '존재하지 않는 유저입니다.' })
    }
  } catch (err) {
    return res.status(err.status).json({
      status: false,
      message: err.message
    })
  }

  return res.sendFile(resolve(process.cwd(), 'public/profile', user.profile))
})

fileRouter.get('/banner/:uuid', async (req, res) => {
  const uuid = req.params.uuid;
  const [lecture] = await db.select('*').from('lectureEntity').where({ uuid }).catch((err) => {})

  try {
    if (!uuid) throw ({ status: 400, message: 'uuid를 입력해주세요.' })
    else {
      if (!lecture) throw ({ status: 400, message: '존재하지 않는 강의 입니다.' })
    }
  } catch (err) {
    return res.status(err.status).json({
      status: false,
      message: err.message
    })
  }

  return res.sendFile(resolve(process.cwd(), 'public/banner', lecture.banner))
})

module.exports = fileRouter;