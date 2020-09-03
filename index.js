var createError = require('http-errors');
const express = require('express');
const path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const articleRouter = require('./routes/articles');
const Article = require('./models/article');
const methodOverride = require('method-override');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const app = express();

mongoose.connect('mongodb://localhost/blog', {
	useNewUrlParser: true, 
	useCreateIndex: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false
});

var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/uploadRouter');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	name: 'session-id',
	secret: '12345-67890-09876-54321',
	saveUninitialized: false,
	resave: false,
	store: new FileStore()
}));

app.use('/users', usersRouter);

app.get('/', (req, res, next) => {
  Article.find().sort({ createdAt: 'desc' })
  .then((articles) => {
    res.render('articles/index', { articles: articles });
  })
});

app.get('/fb', (req, res) => {
  res.render('articles/fb');
});

function auth(req, res, next) {
  if(!req.session.user) {  
    res.render('articles/welcome');
  }
  else {
    if(req.session.user === 'authenticated') { 
       next();
    }
    else {
       res.redirect('/users/login');
    }
  }
}

app.use(auth);

// app.use(passport.initialize());

app.use('/articles', articleRouter);
app.use('/imageUpload', uploadRouter);

//Unknown route handler
app.get("*", function(req, res) {
 res.status(404);
 res.render("articles/error404");
 res.end();
});

app.listen(3000, () => {
	console.log("Connected!");
});

// const employee = {
// 	name: "Gary",
// 	age: 35,
// 	mul() { 
// 		return (this.age * 2) 
// 	}
// };
// console.log(employee.mul());

// let a = {a: 1};
// let b = {a: 1};
// let c = a;
// console.log(a === b);
// console.log(a === c);

// const func = _ => {
// 	let x = y = 0;
// 	++x;
// 	return y; 
// }

// func();
// console.log(typeof x, typeof y);

// const getArr = (item) => {
// 	return 
// 	   [item] ;
// }

// console.log(getArr(3));

// const arr = [];
// for(var i = 0;i < 4;++i);{
// 	arr.push(i + 1);
// }
// console.log(arr);

// let myChar = 'b';
// switch(myChar){
// 	case 'a': console.log('This is A');
// 		break;  s
// 	case 'b': console.log('This is B');
// 		break;
// 	case 'c': console.log('This is C');
// 		break;
// 	default: console.log('Some other character');
// 		break;
// }

// function myfunc() {
// 	return new Promise((resolve, reject) => {
// 		resolve();
// 	});
// }

// myfunc().then(() => console.log('s1'))
// .then(() => console.log('s2'))
// .catch(() => console.log('r1'))
// .then(() => console.log('s3'));
