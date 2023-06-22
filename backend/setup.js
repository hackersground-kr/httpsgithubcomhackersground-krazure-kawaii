const db = require('./database');
const fs = require('fs');
const sqlFiles = ['authEntity.sql', 'categoryEntity.sql', 'lectureEntity.sql', 'reviewEntity.sql', 'majorEntity.sql', 'registEntity.sql'];

async function check(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('디렉토리를 읽을 수 없습니다:', err);
      return;
    }

    sqlFiles.forEach(async (file) => {
      try {
        if (file.endsWith('.sql')) {
          const filePath = `${directoryPath}/${file}`;
          console.log(`실행 중인 SQL 파일: ${filePath}`);

          const sql = fs.readFileSync(filePath, 'utf-8');
          
          await db.raw(sql);
        }
      } catch (err) {
        console.error(err);
        return
      }
    });
  });

  process.exit(0);
}

check(process.cwd() + '/src/sql');
