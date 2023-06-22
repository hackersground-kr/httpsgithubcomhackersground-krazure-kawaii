const db = require('./database');
const { v4 } = require('uuid')
const fs = require('fs');
const path = require('path');
const sqlFiles = ['categoryEntity.sql', 'authEntity.sql', 'lectureEntity.sql', 'majorEntity.sql', 'reviewEntity.sql', 'registEntity.sql']

const sleep = (ms) => {
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}

async function check(directoryPath) {
  console.log(await db.raw('show tables'))
  fs.readdir(directoryPath, async (err, files) => {
    if (err) {
      console.error('디렉토리를 읽을 수 없습니다:', err);
      return;
    }

    sqlFiles.forEach(async (file) => {
      if (file.endsWith('.sql')) {
        const filePath = `${directoryPath}/${file}`;
        console.log(`실행 중인 SQL 파일: ${filePath}`);
        
        const sql = fs.readFileSync(filePath, 'utf-8');
        console.log(sql)
        
        await db.raw(sql);
        sleep(1000 * 3)
      }
    });
  });
  setTimeout(() => {
    process.exit(0);
  }, 1000*24)
}

check(path.join(process.cwd() + '/sql'));
