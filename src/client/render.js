// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE, MAP_WIDTH, MAP_HEIGHT } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  // const scaleRatio = Math.max(1, 100 / window.innerWidth);
  // canvas.width = scaleRatio * window.innerWidth;
  // canvas.height = scaleRatio * window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
  const { me, others, tiles } = getCurrentState();
  if (!me) {
    return;
  }

  // Draw boundaries
  context.fillStyle = 'white';
  context.rect(0, 0, canvas.width, canvas.height);
  context.fill();
  // Draw all bullets
  // bullets.forEach(renderBullet.bind(null, me));

  // Draw all players
  renderMap(tiles);
  // others.forEach(renderMap.bind(null, me));
}

// Renders a ship at the given coordinates
function renderMap(tiles) {
  const canvasX = canvas.width / 2;
  const canvasY = canvas.height / 2;


  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  // context.rotate(direction);
  for(const tile of tiles){
    // console.log(id+","+tile);
    // console.log(tile.x+" "+tile.y);
    context.drawImage(
      getAsset('hexagon.svg'),
      -PLAYER_RADIUS + tile.x,
      -PLAYER_RADIUS + tile.y,
      PLAYER_RADIUS * 2 ,
      PLAYER_RADIUS * 2,
    );
    context.fillStyle = tile.color;
    context.font = "24px Arial";
    context.fillText(tile.level,tile.x, tile.y);
  }
  
  context.restore();
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
