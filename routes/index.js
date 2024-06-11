var express = require('express');
var router = express.Router();
const dbConnect = require('../routes/repository');
const db = require('mysql2');
const bodyParser = require('body-parser');

router.use(express.json());
router.use(bodyParser.json());

// DB connection
const connection = db.createConnection({
  host: 'localhost',
  user: 'root',
  password: '6361427l??',
  database: 'tingting_db'
})
connection.connect();

// logging middleware
const loggingMiddleware = (req, res, next) => {
  console.log(`request.method : ${req.method} , request.url : ${req.url} `);
  next();
}

// error check
router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// check request
router.use(
  loggingMiddleware,
  (res, req, next) => {
    console.log("Finished Logging");
    next();
  }
);


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: '어서와 todoList에..' });
});


// 처음에 작성한 코드
router.get('/call/cats', (req, res, next) => {
  console.log("-check request-");
  connection.query('SELECT * FROM `cats`', (err, results, fields) => {
    if (err) {
      console.log(fields);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'success', data: results });
  })
});

router.post('/call/cats', (req, res, next) => {
  const { name, age, breed } = req.body;
  console.log("Received data:", { name, age, breed });
  connection.query('INSERT INTO cats (name, age, breed) VALUES (?, ?, ?)', [name, age, breed], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'success', data: { id: result.insertId, name, age, breed } })
  });
});

router.delete('/call/cats/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    console.log("id null");
    res.status(400).json({ error: 'id is empty' });
    return;
  }
  connection.query('DELETE FROM cats WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error("500err", err);
      res.status(500).json({ error: "500err" });
      return;
    }
    res.json({ message: 'success', data: result });
  })
});


// async await 은 항상 프로미스를 반환. 아래 API 는 프로미스가 반환되게 짜낸 코드임.
router.get('/cats/:id', async (req, res) => {
  const { id } = req.params;
  console.log("-check request- \n id : ", id);

  let connection;

  try {
    connection = await dbConnect();
    const [result] = await connection.query('SELECT * FROM cats WHERE id = ?', [id]);
    res.json({ message: 'success', data: result });
    console.log(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
    return;

  } finally {
    connection.end();
  }
})

router.get('/cats', async (req, res) => {

  let connection;

  try {
    connection = await dbConnect();
    const [result] = await connection.query('SELECT * FROM `cats`');
    res.json({ message: 'success', data: result });
    console.log(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
    return;

  } finally {
    connection.end();
  }
});

router.post('/cats', async (req, res, next) => {
  const { name, age, breed } = req.body;
  console.log("Received data:", { name, age, breed });

  let connection;

  try {
    connection = await dbConnect();
    const [result] = await connection.query(
      'INSERT INTO `cats` (name, age, breed) VALUES (?, ?, ?)',
      [name, age, breed]
    );
    res.json({ message: 'success', data: { id: result.insertId, name, age, breed } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });

  } finally {
    if (connection) {
      await connection.end();
    }
  }

});

router.delete('/cats/:id', async (req, res) => {
  const { id } = req.params;

  let connection;

  try {

    if (!id) {
      console.log("id null");
      res.status(400).json({ error: 'id is empty' });
      return;
    }
    connection = await dbConnect();
    const [result] = await connection.query('DELETE FROM cats WHERE id = ?', [id]);
    console.log("DELETED: ", id);
    console.log(result);

  } catch (err) {
    console.error("500err", err);
    res.status(500).json({ error: "500err" });
    return;

  } finally {
    connection.end();
  }
});

module.exports = router;