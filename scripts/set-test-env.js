const path = require('path');
process.env.NGINDA_SHARED_DB_PATH = path.join(__dirname, '..', 'data', 'acceptance-test-db.json');
