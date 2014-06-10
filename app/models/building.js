var buildingCollection = global.nss.db.collection('buildings');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var Room = traceur.require(__dirname + '/room.js');
var Mongo = require('mongodb');

class Building{
  static create(obj, fn){
    var building = new Building();
    building._id = Mongo.ObjectID(obj._id);
    building.name = obj.name;
    building.x = parseInt(obj.x);
    building.y = parseInt(obj.y);
    building.rooms = [];
    building.locationId = Mongo.ObjectID(obj.locationId);
    building.userId = Mongo.ObjectID(obj.userId);
    buildingCollection.save(building, ()=>fn(building));
  }

  static findAllByUserId(userId, fn){
    Base.findAllByUserId(userId, buildingCollection, Building, fn);
  }

  static findById(id, fn){
    Base.findById(id, buildingCollection, Building, fn);
  }

  addRoom(obj, fn){
    var room = new Room(obj);
    this.rooms.push(room);
    buildingCollection.update({_id:this._id}, {$push:{rooms:room}}, ()=>fn(this));
  }
}

module.exports = Building;
