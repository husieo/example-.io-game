const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

// should follow a decorator pattern
class TileObject extends ObjectClass {
  constructor(x, y, image) {
    super(shortid(), x, y, 0, 0);
    this.level = 1;
    this.image = image;
  }


}

module.exports = TileObject;
