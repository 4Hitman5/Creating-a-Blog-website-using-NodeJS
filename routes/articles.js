const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Article = require('../models/article')
const cors = require('./cors');
const router = express.Router();

router.options(cors.corsWithOptions, (req, res) => res.sendStatus(200));

router.get('/new', cors.cors, (req, res) => {
	res.render('articles/new', { article: new Article() });
});

router.get('/:slug', cors.cors, (req, res, next) => {
  Article.findOne({ slug: req.params.slug })
  .then((article) => {
    if(article) {
      res.render('articles/show', { article: article });
    }
    else {
      res.redirect('/')
    }
  })
  .catch((err) => {
    res.status = 404;
    next(err);
  })
});

router.get('/edit/:id/ER', cors.corsWithOptions, (req, res, next) => {
	Article.findById(req.params.id)
	.then((article) => {
		var article_dup = article;
	    article_dup.secretKey = null;
		res.render('articles/secret_edit', { article: article_dup });
	}, (err) => next(err))
	.catch((err) => {
		res.status = 404;
		next(err);
	})
});

router.get('/delete/:id/ER', cors.corsWithOptions, (req, res, next) => {
	Article.findById(req.params.id)
	.then((article) => {
		var article_dup = article;
	    article_dup.secretKey = null;
		var options = 'delete';
		res.render('articles/secret_delete', { article: article_dup });
	}, (err) => next(err))
	.catch((err) => {
		res.status = 404;
		next(err);
	})
});


router.get('/edit/:id', cors.corsWithOptions, (req, res, next) => {
	Article.findById(req.params.id)
	.then((article) => {
		if(article) {
			res.render('articles/edit', { article: article });
		}
		else {
			res.redirect('/articles');
		}
	}, (err) => next(err))
	.catch((err) => {
		res.status = 404;
		next(err);
	})
});

router.post('/secret/delete/:id', cors.corsWithOptions, function(req, res, next) {
	Article.findById(req.params.id)
	.then((article) => {
		if(article.secretKey === req.body.secretKey) {
			res.redirect(`/articles/delete/${ req.params.id }`);
		}
		else {
			console.log('Wrong Key');
			res.send('You have entered an incorrect key');
		}
	})
	.catch((err) => next(err));
});

router.post('/secret/edit/:id', cors.corsWithOptions, function(req, res, next) {
	Article.findById(req.params.id)
	.then((article) => {
		if(article.secretKey === req.body.secretKey) {
			res.redirect(`/articles/edit/${ req.params.id }`);
		}
		else {
			console.log('Wrong Key');
			res.send('You have entered an incorrect key');
		}
	})
	.catch((err) => next(err));
});

router.get('/delete/:id', cors.corsWithOptions, (req, res, next) => {
	Article.findById(req.params.id)
	.then((article) => {
		res.render('articles/delete', { article: article });
	})
});


router.post('/', cors.cors, (req, res) => {
	Article.create(req.body)
	.then((article) => {
		if(article) {
			console.log("created");
			article.save();
			res.redirect(`/articles/${article.slug}`);
		}
		else {
			res.render('articles/new', { article: article });
		}
	})
	.catch((err) => console.log(err))
});

router.put('/:id', cors.corsWithOptions, (req, res) => {
	Article.findByIdAndUpdate(req.params.id, {
		$set: req.body
	}, { new: true })
	.then((article) => {
		if(article) {
			console.log("updated");
			article.save();
			res.redirect(`/articles/${article.slug}`);
		}
		else {
			res.render('articles/edit', { article: article });
		}
	})
	.catch((article) => res.render('articles/edit', { article: article }));
});

router.delete('/:id', cors.corsWithOptions, (req, res) => {
	Article.findByIdAndDelete(req.params.id)
	.then((article) => {
		res.redirect('/');
	}, (err) => next(err))
	.catch((err) => {
		res.status = 404;
		next(err);
	})
});

module.exports = router;