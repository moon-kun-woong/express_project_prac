var express = require('express');
var router = express.Router();
const dbConnect = require('../routes/repository');

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

 router.put('/cats/:id' , async (res, req) =>{
  const { id } = req.params;

  let connection;

  try {
    if(!id){
    console.log("undifind id element.")
    res.status(400).json({ error: 'undifind Id unaccessed' });
    return;
    }
    connection = await dbConnect();
    const [result] = await connection.query('PUT FROM cats WHERE id=?', [id]);
    console.log("Put : " , id);
    console.log(result);


  } catch (error) {
    console.error("500err", err);
    res.status(500).json({ error: "500err" });
    return;

  } finally {
    setTimeout=>(console.log("this is async await function logic"), 3000);
  }

 })

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