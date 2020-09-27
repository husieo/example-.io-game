const Constants = require('../shared/constants');
const Player = require('./player');
const Tile = require('./tile');
const applyCollisions = require('./collisions');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE, MAP_WIDTH, MAP_HEIGHT, SCORE_PER_SECOND, TURN_TIME } = Constants;

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.tiles = []; 
    this.bullets = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);

    for (let verticalIndex = 0; verticalIndex < MAP_WIDTH; verticalIndex++) {
      for (let horizontalIndex = 0; horizontalIndex < MAP_HEIGHT; horizontalIndex++) {
        let id = verticalIndex*MAP_WIDTH + horizontalIndex;
        let even = verticalIndex % 2;
        let shift = PLAYER_RADIUS / 2;
        let x = horizontalIndex*PLAYER_RADIUS*2 + even*PLAYER_RADIUS;
        let y = verticalIndex*(PLAYER_RADIUS*2-shift);
        let tile = new Tile(x,y,)
        this.tiles.push(tile)
      }
    }
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * 0.5;
    const y = Constants.MAP_SIZE * 0.5;
    console.log(x,y)
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  handleClick(socket, x,y) {
    for(const tile of this.tiles){
      // console.log(y+","+tile.y);
      // console.log(Math.abs(tile.x-x)+","+Math.abs(tile.y-y));
      if(Math.abs(tile.x-x) < PLAYER_RADIUS && Math.abs(tile.y-y) < PLAYER_RADIUS){
        this.upgradeTile(tile,socket);
        break;
      }
    }
  }

  upgradeTile(tile, socket){
    if (this.players[socket.id]) {
      let player = this.players[socket.id];
      if(tile.owner != socket.id){
        console.log(tile.level*10);
        if(player.score >= tile.level*10){
          player.score -= tile.level*10;
          tile.owner = socket.id;
          tile.color = player.color;
          tile.level = Math.max(1, tile.level-3);
        }
      } else if(player.score > 10){
        tile.level += 1;
        player.score -= 10;
      }
    }
  }

  update() {
    // Calculate time elapsed
    this.triggerScoreUpdate();


    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard, this.tiles));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  triggerScoreUpdate(){
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    if(dt > TURN_TIME){
      this.lastUpdateTime = now;
    } else{
      return;
    }
    
    for(const tile of this.tiles){
      if (this.players[tile.owner]) {
        let player = this.players[tile.owner];
        player.score += tile.level;
      }
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard, tiles) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      tiles: tiles,
      leaderboard,
    };
  }
}

module.exports = Game;
