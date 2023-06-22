const express = require('express');
const { v4 } = require('uuid');
const db = require('../database');
const jsonwebtoken = require('../utils/jsonwebtoken');
require("dotenv").config();

const reviewRouter = express.Router();

reviewRouter.post('/insert', async (req, res) => {
  const { content, uuid, title, star } = req.body;
  
  const token = req.headers.authorization.split(' ')[1]
  const verify = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const [user] = await db.select('*').from('authEntity').where({ uuid: verify.uuid }).catch((err) => {});
  const [isLecture] = await db.select('*').from('lectureEntity').where({ uuid }).catch((err) => {});
  const [check] = await db.select('*').from('registEntity').where({ author: user.uuid, lectureUUID: uuid }).catch((err) => {});
  try {
    if (!uuid) throw ({ status: 400, msg: "강의 UUID가 입력되지 않았습니다." });
    if (!isLecture) throw ({ status: 404, msg: "해당하는 ID를 가진 강의가 존재하지 않습니다." });
    if (!star) throw ({ status: 400, msg: "후기 별점이 입력되지 않았습니다." });
    if (!title) throw ({ status: 400, msg: "후기 제목이 입력되지 않았습니다." });
    if (!content) throw ({ status: 400, msg: "후기 내용이 입력되지 않았습니다." });
    if (!check) throw ({ status: 400, msg: "수강하지 않은 강의에 대한 후기는 작성할 수 없습니다." })
    if (!token || !verify.success || !user) throw ({ status: 400, msg: "비 정상 적인 토큰 입니다." });
    if (user.role !== "student") throw ({ status: 400, msg: '비 정상 적인 토큰 입니다.' })
  } catch (e) {
    return res.status(e.status).send({
      success: false,
      msg: e.msg,
    });
  }
  
  try {
    await db.insert({
      uuid: v4(),
      content,
      author: user.uuid,
      lectureUUID: uuid,
      star,
      title
    }).into('reviewEntity')
  
    return res.status(200).send({
      success: true,
      msg: '후기가 성공적으로 작성되었습니다.',
    });
  } catch (err) {
    console.log(err)
    return res.status(500).send({
      success: false,
      msg: '후기를 작성하는 도중 오류가 발생하였습니다.',
    });
  }
});

reviewRouter.delete('/delete', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const verify = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const [user] = await db.select('*').from('authEntity').where({ uuid: verify.uuid }).catch((err) => {});
  
  const { id } = req.body;
  
  const [isReview] = await db.select('*').from('reviewEntity').where({ uuid: id, author: user.uuid }).catch((err) => {});
  
  try {
    if (!id) throw ({ status: 400, msg: "후기 UUID가 입력되지 않았습니다." });
    if (!isReview) throw ({ status: 404, msg: "해당하는 후기가 없거나 삭제할 권한이 없습니다." });
  } catch (e) {
    return res.status(e.status).send({
      success: false,
      msg: e.msg,
    });
  }
  
  try {
    await db.delete().from('reviewEntity').where({ uuid: id, author: user.uuid })

    res.status(200).send({
      success: true,
      msg: '후기가 성공적으로 삭제되었습니다.',
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      msg: '후기를 삭제하는 도중 오류가 발생하였습니다.',
    });
  }
})

reviewRouter.get('/getLectureReview/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const [isReview] = await db.select('*').from('reviewEntity')
    .where({ uuid: id })
    .catch((err) => {});
  try {
    if (!id) throw ({ status: 400, message: '강의의 id를 입력해주세요.' })
    if (!isReview) throw ({ status: 404, message: '해당 강의의 리뷰를 찾을 수 없습니다.' })
  } catch (err) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    })
  }

  try {
    return res.status(200).json({
      success: true,
      isReview: {
        uuid: isReview.uuid,
        star: isReview.star,
        title: isReview.title,
        content: isReview.content,
        createdAt: isReview.createdAt,
      },
      author: {
        uuid: isReview.author,
      },
      lecture: {
        uuid: isReview.lectureUUID
      }
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Errors'
    })
  }
})

reviewRouter.get('/getReview/:id', async (req, res) => {
  const { id } = req.params;
  
  const isReview = await db.select('*').from('reviewEntity').where({ lectureUUID: id }).catch((err) => {});

  try {
    if (!id) throw ({ status: 400, message: '강의의 id를 입력해주세요.' })
    if (!isReview) throw ({ status: 404, message: '해당 강의의 리뷰를 찾을 수 없습니다.' })
  } catch (err) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    })
  }

  try {
    return res.status(200).json({
      success: true,
      isReview
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Errors'
    })
  }
})

module.exports = reviewRouter;
