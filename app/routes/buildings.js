'use strict';

var traceur = require('traceur');
var Location = traceur.require(__dirname + '/../models/location.js');
var Building = traceur.require(__dirname + '/../models/building.js');
var Floor = traceur.require(__dirname + '/../models/floor.js');

// var Mongo = require('mongodb');

exports.new = (req, res)=>{
  if(res.locals.user){
    Location.findAll(locations=>res.render('buildings/new', {locations: locations, title: 'Create Building'}));
  }else{
    res.redirect('/');
  }
};

exports.create = (req, res)=>{
  console.log(req.body);
  Building.create(req.body, building=>{
    res.redirect('/buildings/' + building._id);
  });
};

exports.show = (req, res)=>{
  Building.findById(req.params.id, building=>{
    Location.findAll(locations=>{
      Floor.findAll(floors=>{
        res.render('buildings/show', {building: building, locations: locations, floors: floors, title: 'Building: ' + building.name});
      });
    });
  });
};


exports.index = (req, res)=>{
  Building.findAllByUserId(req.session.userId, buildings=>{
    console.log(buildings);
    res.render('buildings/index', {buildings:buildings, title: 'Buildings'});
  });
};
