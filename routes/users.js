var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var session = require('express-session');
const cors = require('./cors');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', cors.corsWithOptions, function(req, res, next) {
  res.render('articles/welcome');
});

router.get('/signup', cors.corsWithOptions, function(req, res, next) {
	res.render('articles/signup', { user: new User() });
});

router.get('/login', cors.corsWithOptions, function(req, res, next) {
	res.render('articles/login', { user: new User() });
});

// router.post('/signup', cors.corsWithOptions, function(req, res, next) {
// 	User.register(new User({ email: req.body.email, username: req.body.username}), req.body.password, (err, user) => {
// 		if(err) {
// 			res.statusCode = 500;
// 			res.setHeader('Content-Type', 'application/json');
// 			res.json({err: err});
// 		}
// 		else {
// 			passport.authenticate('local')(req, res, () => {
// 				res.statusCode = 200;
// 				res.setHeader('Content-Type', 'application/json');
// 				res.json({success: true, status: 'Registration Successful!'});
// 			});
// 		}
// 	});
// });

router.post('/signup', cors.corsWithOptions, function(req, res, next) {
	User.findOne({ username: req.body.username })
	.then((user) => {
		if(user !== null) {
			const item = {
				value: 'User ' + req.body.username + ' already exists',
				page: 'users/signup'
			};
			res.render('articles/redirect', { item: item });
		}	
	});
	User.findOne({ email: req.body.email })
	.then((user) => {
		if(user !== null) {
			const item = {
				value: 'User with registered email as ' + req.body.email + ' already exists',
				page: 'users/signup'
			};
			res.render('articles/redirect', { item: item });
		}
		else {
			return User.create({
				email: req.body.email,
				username: req.body.username,
				password: req.body.password
			})
		}
	})
	.then((user) => {
		res.statusCode = 200;
		res.render('articles/login', { user: user });
	}, (err) => next(err))
	.catch((err) => next(err));
});


router.post('/login', cors.corsWithOptions, function(req, res, next) {
	if(!req.session.user) { 
		var username = req.body.username;
		var password = req.body.password;
		var email = req.body.email;

        User.findOne({username: username})
        .then((user) => {
        	if(user === null) {
				const item = {
					value: 'User ' + username + ' does not exist',
					page: 'users/login'
				};
				res.render('articles/redirect', { item: item });

        	}
        	else if(user.password !== password) {
				const item = {
					value: 'Your password is incorrect',
					page: 'users/login'
				};
				res.render('articles/redirect', { item: item });
        	}
        	else if(user.email !== email) {
				const item = {
					value: 'Your registered email is incorrect',
					page: 'users/login'
				};
				res.render('articles/redirect', { item: item });
        	}
        	else if(username === user.username && password === user.password && email === user.email) {
        		req.session.user = 'authenticated';
        		res.statusCode = 200;
        		const item = {
					value: 'You are authenticated',
					page: ''
				};
				res.render('articles/redirect', { item: item });
        	}
        })	
        .catch((err) => next(err));
    }
    else {
    	res.statusCode = 200;
    	res.setHeader('Content-Type', 'plain/text');
    	const item = {
			value: 'You are already authenticated',
			page: ''
		};
		res.render('articles/redirect', { item: item });
    }
});

// router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
// 	const authHeader = req.headers['authorization'];
// 	var token = authHeader && authHeader.split(' ')[1];
// 	const user = new User(req.body);
// 	if(token == null) {
// 		token = authenticate.getToken({_id: req.user._id});
// 		user.tokens = user.tokens.concat({ token });
// 		res.statusCode = 200;
// 		res.setHeader('Content-Type', 'application/json');
// 		res.json({success: true, token: token, status: 'You are successfully logged in!'});
// 		res.redirect('/');
// 	}
// 	else {
// 		if(authenticate.verifyUser) {
// 			res.json({success: true, status: 'You are already logged in!'});
// 			res.redirect('/');
// 		}
// 		else {
// 			var err = new Error('Invalid Token');
// 			err.status = 403;
// 			next(err);
// 		}
// 	}
// });

// router.get('/auth/facebook', passport.authenticate('facebook'));

// router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect}))

router.get('/logout', cors.corsWithOptions, function(req, res, next) {
	if(req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
		const item = {
			value: 'You have successfully logged out',
			page: ''
		};
		res.render('articles/redirect', { item: item });
	}
	else {
		var err = new Error('You are not logged in');
		err.status = 403;
		next(err);
	}
});

// router.post('/logoutall', authenticate.verifyUser, async (req, res) => {
//     try {
//         req.user.tokens = []
//         await req.user.save()
//         res.send()
//     } catch (error) {
//         res.status(500).send()
//     }
// })

module.exports = router;