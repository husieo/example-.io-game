module.exports = Object.freeze({
  PLAYER_RADIUS: 30,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,
  PLAYER_FIRE_COOLDOWN: 0.25,

  BULLET_RADIUS: 3,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 10,

  SCORE_BULLET_HIT: 20,
  START_SCORE: 20,
  SCORE_PER_SECOND: 1,
  TURN_TIME: 1, 

  MAP_SIZE: 500,
  MAP_WIDTH: 5,
  MAP_HEIGHT: 5,

  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
    CLICK: 'click'
  },
});
