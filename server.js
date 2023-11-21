//env 처리
require('dotenv').config();

const express = require('express')
const app = express()

app.use(express.static(__dirname + '/public'))
app.set('view engin', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const { MongoClient } = require('mongodb')

let db
const url = `mongodb+srv://${process.env.MONGOID}:${process.env.MONGOPW}@codingapple.dke81js.mongodb.net/?retryWrites=true&w=majority`
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(8080, () => {
  console.log('http://localhost:8080 에서 서버 실행 중')
})
}).catch((err)=>{
  console.log(err)
})



// arduino 설정
var SerialPort = require('serialport').SerialPort;
var serialPort = new SerialPort({
    path: 'COM5',
    baudRate : 9600,
    // defaults for Arduino serial communication
    dataBits : 8,
    parity : 'none',
    stopBits: 1,
    flowControl: false
})

// 아두이노 연결
serialPort.on('open', function () {
  console.log('open serial communication');
  serialPort.on('data', function (data) {
    console.log(data.toString());
  });
  // console.log('Data: ', serialPort);
})


// arduino web
app.get('/led/:action', function (req, res) {
    
  var action = req.params.action || req.params;
  
    
  if (action == 'on') {
    
    serialPort.write("1", function(err) {
      if (err) {
        return console.error('Error writing to serial port: ', err.message);
      }
      console.log('Sending: 1');
      return res.send('Led light is on!');
    });
  } 
  else if (action == 'off') {
    serialPort.write("0", function(err) {
      if (err) {
        return console.error('Error writing to serial port: ', err.message);
      }
      console.log('Sending: 0');
      res.send('Led light is off!');
    });
  }
  else {
    return res.send('Action: ' + action);
  }

});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/news', (req, res) => {
  db.collection('post').insertOne({title: '타이틀'})
  // res.send('뉴스다')
})

app.get('/list', async (req, res) => {
  let result = await db.collection('post').find().toArray()
  // console.log(result[0].title)

  res.render('list.ejs', { post: result })
})

app.get('/time', async (req, res) => {
  const date = new Date().toISOString().split('T')[0]
  console.log(date)
  res.render('time.ejs', { data: date })
})

app.get('/write', (req, res) => {
  res.render('write.ejs')
})

app.post('/new-post', async (req, res) => {
  try {
    if (req.body.title == '' || req.body.content == '') {
    res.send('제목이 없습니다.')
    } else {
      await db.collection('post').insertOne({ title: req.body.title, content: req.body.content })
      res.redirect('/list')
    }
    } catch (e) {
      console.log(e)
      res.status(500).send('서버 에러 났습니다.')
    }
  
})
