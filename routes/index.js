var express = require('express');
var router = express.Router();
const dbConnect = require('../routes/repository');
const bodyParser = require('body-parser');
const { error } = require('console');

router.use(express.json());
router.use(bodyParser.json());


// 미들웨어
const loggingMiddleware = (req , res, next)=>{
  console.log(`${req.method} 이것이-미들 ${req.url} 웨어`);
  next();
}


//  async 와 sync 의 사용
let text = "default";
const data = require("fs").readFileSync("./public/test.txt",{encoding:"utf-8"});
const data22 = require("fs").readFile("./public/test.txt",{encoding:"utf-8"},(err,data)=>{
  text = data;
});

router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


router.use(
  loggingMiddleware,
  (res,req,next)=>{
    console.log("Finished Logging...---------");
    next();
  }
);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '어서와 todoList에..' });
});


router.get('/cats/:id', async (req, res) =>{
  const { id } = req.params;
  console.log("-check request- \n id : " , id);

  let connection;
  
  try {
    connection = await dbConnect();
    const [result] = await connection.query('SELECT * FROM cats WHERE id = ?', [id]);
    res.json({ message:'success', data: result});
    console.log(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
    return;

  } finally{
    connection.end();
  }

})

router.get('/cats', async (req, res) => {

  let connection;

  try {
    connection = await dbConnect();
    const [result] = await connection.query('SELECT * FROM `cats`');
    res.json({message:'success', data: result});
    console.log(result);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
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
    
    if(!id){
      console.log("id null");
      res.status(400).json({error:'id is empty'});
      return;
    }
    connection = await dbConnect();
    const [result] = await connection.query('DELETE FROM cats WHERE id = ?' , [id]);
    console.log("DELETED: ", id);
    console.log(result);
    
  } catch (err) {
    console.error("500err" , err);
    res.status(500).json({error:"500err"});
    return;

  } finally {
    connection.end();
  }
});

module.exports = router;
