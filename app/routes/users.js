'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.new = (req, res)=>{
  res.render('users/login', {title: 'Login'});
};

exports.create = (req, res)=> {
  User.create(req.body, u=> {
    if(u) {
      req.session.userId = u._id;
      res.redirect('/buildings/new');
    } else {
      req.session.userId = null;
      res.redirect('/login');
    }
  });
};

exports.login = (req, res)=> {
  User.login(req.body, u=>{
    if(u) {
      req.session.userId = u._id;
      res.redirect('/buildings/new');
    } else {
      req.session.userId = null;
      res.redirect('/login');
    }
  });
};

exports.logout = (req, res)=>{
  req.session = null;
  delete req.session;
  res.redirect('/');
};

exports.lookup = (req, res, next)=> {
  User.findById(req.session.userId, u=>{
    res.locals.user = u;
    next();
  });
};

// exports.bounce = (req, res, next)
