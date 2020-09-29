const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');
const TileObject = require('./tileobject');

class Tile extends ObjectClass {
  constructor(x, y) {
    super(shortid(), x, y, 0, 0);
    this.towns = [];
    this.features = [];
    this.level = 0;
    this.owner = 0;
    this.color = "black";
    this.generateFeature();
    this.generateFeature();
  }

  generateTown(){
    let x = Math.floor(Math.random()*Constants.PLAYER_RADIUS - Constants.PLAYER_RADIUS/2);
    let y = Math.floor(Math.random()*Constants.PLAYER_RADIUS - Constants.PLAYER_RADIUS/2);
    this.towns.push(new TileObject(x, y, "IndustrialAgesTown.png"));
  } 

  generateFeature(){
    let x = Math.floor(Math.random()*Constants.PLAYER_RADIUS/2);
    let y = Math.floor(Math.random()*Constants.PLAYER_RADIUS/2);
    this.features.push(new TileObject(x, y, "TreePine.png"));
  } 
}

module.exports = Tile;
