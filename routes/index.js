var express = require('express');
const { connect } = require('http2');
var router = express.Router();
const db = require('mysql');
const bodyParser = require('body-parser');
const { error } = require('console');


// const { add_todo_list } = require("../public/javascripts/add_todo_list");

router.use(express.json());
router.use(bodyParser.json());

// 미들웨어
const loggingMiddleware = (req , res, next)=>{
  console.log(`${req.method} 이것이-미들 ${req.url} 웨어`);
  next();
}


// 
const resolveIndexByUserId = (req,res, next)=> {
  const {
    body,
    params: {id} } = req;

  const parsedId = parseInt(id);
  if(isNot(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user)=> user.is === parsedId);
  if(findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;
  next(new Error);
};


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


router.get('/cats/:id', (req, res) =>{
  const { id } = req.params;
  console.log("-check request-" , id);
  
  db.query('SELECT * FROM cats WHERE id = ?', [id], (err,results, fields)=>{
    if (err){
      console.err(err);
      res.status(500).json({error: err.message});
      return;
    }
    res.json({ message:'success', data: results});
  })
})

router.get('/cats', (req, res, next) => {
  console.log("-check request-");
  db.query('SELECT * FROM `cats`', (err, results,fields) => {
    if (err) {
      console.log(fields);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'success', data: results });
  })
});


router.post('/cats', (req, res, next) => {
  const { name, age, breed } = req.body;
  console.log("Received data:", { name, age, breed });
  db.query('INSERT INTO cats (name, age, breed) VALUES (?, ?, ?)', [name, age, breed], (err, result) => {
    if (err) {
      console.log(err)
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(result)
    res.json({ message: 'success', data: { id: result.insertId, name, age, breed } });
  })
});


router.delete('/cats', (req, res) => {
  const { id } = req.params;

  if(!id){
    console.log("id null");
    res.status(400).json({error:'id is empty'});
    return;
  }
  db.query('DELETE FROM cats WHERE id = ?' , [id], (err,result) =>{
    if(err){
      console.error("500err" , err);
      res.status(500).json({error:"500err"});
      return;
    }
    res.json({ message: 'success', data: result });
  })
});

module.exports = router;
