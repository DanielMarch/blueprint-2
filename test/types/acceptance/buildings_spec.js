/* global describe, before, beforeEach, it */

'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var app = require('../../../app/app');
var request = require('supertest');

var User;

describe('users', function(){
  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      factory('user', function(users){
        global.nss.db.collection('locations').drop(function(){
          factory('location', function(locations){
            done();
          });
        });
      });
    });
  });

  describe('Login', function(){
    var cookie;
    beforeEach(function(done){
      request(app)
      .post('/login')
      .send('email=sue@aol.com')
      .send('password=5678')
      .end(function(err, res){
        cookie = res.headers['set-cookie'];
        var c1 = cookie[0].split(';');
        var c2 = cookie[1].split(';');
        cookie = c1[0] + '; '+ c2[0];
        done();
      });
    });

    describe('GET /buildings/new', function(){
      it('should show the new buldings page', function(done){
        request(app)
        .get('/buildings/new')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          done();
        });
      });
      it('should not show the new buldings page - not logged in', function(done){
        request(app)
        .get('/buildings/new')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/');
          done();
        });
      });
    });

    describe('POST /buildings', function(){
      it('should save a new building and redirect', function(done){
        request(app)
        .post('/buildings')
        .set('cookie', cookie)
        // .field('_id', '0123456789abcdef01234555')
        .field('name', 'hut')
        .field('x', '5')
        .field('y', '5')
        .field('locationId', 'a123456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          // expect(res.headers.location).to.equal('/buildings/0123456789abcdef01234555');
          done();
        });
      });
    });

    describe('GET /buildings/:id', function(){
      it('should display a specific building with a provided ID', function(done){
        request(app)
        .get('/buildings/c123456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.include('castle');
          expect(res.text).to.include('$8145');
          done();
        });
      });
    });
  });
});
