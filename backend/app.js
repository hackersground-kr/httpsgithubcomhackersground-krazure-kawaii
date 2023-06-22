const express = require('express');
const cors = require('cors');
const path = require('path');

const authRouter = require('./routes/auth');
const lectureRouter = require('./routes/lecture');
const reviewRouter = require('./routes/review');
const fileRouter = require('./routes/file');
const categoryRouter = require('./routes/category');
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cors());

const staticDir = path.resolve(__dirname, './public/dist');
app.use(express.static(staticDir));

app.get('/404/*', (req, res) => {
  res.sendFile(path.resolve(staticDir, 'index.html'));
})
    
app.get('/api', (req, res) => { 
  return res.status(200).json({
    status: true
  }) 
});

app.use('/api/auth', authRouter)
app.use('/api/lecture', lectureRouter)
app.use('/api/file', fileRouter)
app.use('/api/review', reviewRouter)
app.use('/api/category', categoryRouter)

app.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});

module.exports = app;
