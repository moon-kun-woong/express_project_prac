var express = require('express');
const { connect } = require('http2');
var router = express.Router();
const db = require('mysql');

// const { add_todo_list } = require("../public/javascripts/add_todo_list");

router.use(express.json());

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



router.get(
  '/api/users', 
  (req, res, next)=>{
    console.log('Base URL1');
    next();
  },
  (req, res, next)=>{
    console.log('Base URL2');
    next();
  },
  (req, res, next)=>{
    console.log(data22);
    next();
  },
  (req , res, next) => {
    console.log(req.query)
    const {query: {filter, value}} = req;

    if(!filter && !value) return res.send(mockUsers);
    
    if(filter && value) return res.send(
      mockUsers.filter((user)=> user[filter].inclues(value))
    );
  }
);

// ------- api--------

router.get('/todolist', (req, res, next) => {
  res.render('todoList');
});


router.get('/getAllList', resolveIndexByUserId,(req , res) => {
  res.send(db.escapeId());
});



router.get('/createTodo', resolveIndexByUserId ,(req,res)=>{
  console.log(req.params);
  const parsedId = parseInt(req.params.id);
  console.log(parsedId);

  if(isNotInt(parsedId)) 
    return res.status(400).send({msg: "Bad Resquest. Invalid Id."
  });
  
  const findUser = mockUsers.find((user) => user.id === parsedId);

  if(!findUser) return res.sendStatus(404);
  return res.send(findUser);
});


router.post('/addWork', (req, res) => {
  const newWork = req.body.newWork;
  works.push(newWork);
  res.redirect('/');
});


router.post('/createTodo', (req, res) => {
  res.send('Got a POST request');
  var body = req.body;
  var sql = "insert user set id=?, work=? where bnum="
  connect.query(sql, (err,result)=>{
    sql.get(res.params());
  })
});

router.put('/user', (req, res) => {
  res.send('Got a PUT request at /user');
});

router.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user');
});

module.exports = router;
