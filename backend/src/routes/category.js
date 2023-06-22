const express = require('express');
const db = require('../database');
const jsonwebtoken = require('../utils/jsonwebtoken');
const uuid = require('uuid');
require("dotenv").config();
const categoryRouter = express.Router();

categoryRouter.post('/insert', async (req, res) => {
  const { name } = req.body;

  const token = req.headers.authorization[1];
  const verify = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const [user] = await db.select('*').from('authentity').where({ uuid: verify.uuid }).catch((err) => { });

  try {
    if (!name) throw ({ status: 400, message: "카테고리 내용을 입력해주세요" });
    if (!token || !verify.success || !user) throw ({ status: 400, message: "비 정상적인 토큰 입니다." });
    else {
      if (user.role !== "admin") throw ({ status: 401, message: "권한이 없습니다." })
    }
  } catch (e) {
    return res.status(e.status).json({ success: false, message: e.message });
  }

  try {
    const [isCategory] = await db.select("*").from('categoryEntity').where({ name }).catch((err) => {});
    if (!isCategory) {
      await db.insert({
        uuid: uuid.v4(),
        name
      }).into('categoryEntity');
      
      return res.status(201).send({
        success: true,
        message: "카테고리 추가에 성공했습니다."
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "이미 해당 내용을 가진 카테고리가 존재합니다."
      });
    }
  } catch (e) {
    return res.status(500).send({
      success: false,
      message: "카테고리를 추가하는 도중 에러가 발생했습니다."
    });
  }
});

categoryRouter.delete('/delete', async (req, res) => {
  const { uuid } = req.body;

  const token = req.headers.authorization[1];
  const verify = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  const [user] = await db.select('*').from('authentity').where({ uuid: verify.uuid }).catch((err) => { });
  const [category] = await db.select('*').from('categoryEntity').where({ uuid }).catch((err) => { });
  try {
    if (!uuid) throw ({ status: 400, message: "카테고리 ID를 입력해주세요" });
    if (!token || !verify.success || !user) throw ({ status: 400, message: "비 정상적인 토큰 입니다." });
    else {
      if (user.role !== "admin") throw ({ status: 401, message: "권한이 없습니다." })
      if (!category) throw ({ status: 400, message: "존재하지 않는 카테고리 입니다." });
    }
  } catch (e) {
    return res.status(e.status).json({
      success: false,
      message: e.message
    });
  }

  try {
    await db.delete().from("categoryEntity").where({ uuid });
    return res.status(200).json({
      success: true,
      message: "성공적으로 해당하는 카테고리를 삭제했습니다."
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "카테고리를 삭제하는 도중 에러가 발생했습니다."
    });
  }
});

categoryRouter.get('/list', async (req, res) => {
  try {
    const data = await db.select("*").from("categoryEntity").catch((err) => {});
    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "저장된 카테고리가 존재하지 않습니다."
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "성공적으로 값을 조회했습니다.",
        data
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "카테고리 조회 도중 에러가 발생했습니다."
    });
  }
});

categoryRouter.get('/search/:name', async (req, res) => {
  const { name } = req.params;
  try {
    if (!name) throw ({ status: 400, message: "카테고리 내용을 입력해주세요." });

    const isData = await db.select("*").from("categoryEntity").where('name', 'like', `%${name}%`).catch((err) => {});
    if (isData.length === 0) throw ({ status: 404, message: "해당하는 내용을 가진 카테고리가 존재하지 않습니다." });

    return res.status(200).json({
      success: true,
      message: "성공적으로 값을 조회했습니다.",
      data: isData
    });
  } catch (e) {
    return res.status(e.status).json({
      success: false,
      message: e.message
    });
  }
});

module.exports = categoryRouter;
