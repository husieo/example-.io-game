// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE, MAP_WIDTH, MAP_HEIGHT,TILE_OBJECT_SIZE } = Constants;

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
  const canvasX = canvas.width / 3;
  const canvasY = canvas.height / 3;


  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  // context.rotate(direction);
  for(const tile of tiles){
    // console.log(id+","+tile);
    // console.log(tile.x+" "+tile.y);
    context.drawImage(
      getAsset('hexagon.png'),
      -PLAYER_RADIUS + tile.x,
      -PLAYER_RADIUS + tile.y,
      PLAYER_RADIUS * 2 ,
      PLAYER_RADIUS * 2,
    );
    // drawColoredImage(context, 
    //   'hexagon.png', 
    //   -PLAYER_RADIUS + tile.x,  -PLAYER_RADIUS + tile.y,  
    //   PLAYER_RADIUS * 2 , PLAYER_RADIUS * 2,
    //   '#000000',tile.color);
    context.fillStyle = tile.color;
    context.fillRect(tile.x, tile.y, TILE_OBJECT_SIZE/2, TILE_OBJECT_SIZE/2);
    for(const town of tile.towns){
      context.drawImage(
        getAsset(town.image),
        tile.x + town.x,
        tile.y + town.y,
        TILE_OBJECT_SIZE,
        TILE_OBJECT_SIZE
      );
    }
    for(const feature of tile.features){
      context.drawImage(
        getAsset(feature.image),
        tile.x + feature.x,
        tile.y + feature.y,
        TILE_OBJECT_SIZE,
        TILE_OBJECT_SIZE
      );
    }
  }
  
  context.restore();
}

function drawColoredImage(context, image, x, y, width, height, initialColorHex, colorHex) {
  context.drawImage(
    getAsset(image),
    x,
    y,
    width,
    height
  );

  var imageData = context.getImageData(x, y, width, height);
  var data = imageData.data;

  for (var i = 0; i < data.length; i+= 4) {
    var colorHex = rgbToHex(data[i], data[i+1], data[i+2]); 
    console.log(colorHex);
    if(colorHex === initialColorHex){
      var colorRGB = hexToRgb(colorHex);
      data[i] = colorRGB.r; // change Red
      data[i+1] = colorRGB.g; // change Green
      data[i+2] = colorRGB.b; // change Blue
    }
  }

  // Update the canvas with the new data
  context.putImageData(imageData, x, y);

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

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}