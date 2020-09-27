const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Tile extends ObjectClass {
  constructor(x, y) {
    super(shortid(), x, y, 0, 0);
    this.level = 1;
    this.owner = 0;
    this.color = "black";
  }


}

module.exports = Tile;
