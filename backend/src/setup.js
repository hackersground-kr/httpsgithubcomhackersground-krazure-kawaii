const db = require('./database');
const fs = require('fs');
const path = require('path');
const sqlFiles = ['categoryEntity.sql', 'authEntity.sql', 'lectureEntity.sql', 'majorEntity.sql', 'reviewEntity.sql', 'registEntity.sql']

async function check(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
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
      }
    });

    setTimeout(() => {
      process.exit(0);
    }, 1000 * 10);
  });
}

check(path.join(process.cwd() + '/src/sql'));